package sa.edu.fbsu.campus.wallet.tuition.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.common.events.WalletTransactionEvent;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.wallet.application.WalletService;
import sa.edu.fbsu.campus.wallet.domain.LedgerEntry;
import sa.edu.fbsu.campus.wallet.domain.TransactionType;
import sa.edu.fbsu.campus.wallet.infra.LedgerEntryRepository;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionInvoice;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionReceipt;
import sa.edu.fbsu.campus.wallet.tuition.dto.PayTuitionRequest;
import sa.edu.fbsu.campus.wallet.tuition.dto.TuitionInvoiceResponse;
import sa.edu.fbsu.campus.wallet.tuition.dto.TuitionReceiptResponse;
import sa.edu.fbsu.campus.wallet.tuition.infra.TuitionInvoiceRepository;
import sa.edu.fbsu.campus.wallet.tuition.infra.TuitionReceiptRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Service
public class TuitionService {

    private static final Logger log = LoggerFactory.getLogger(TuitionService.class);
    private static final SecureRandom RANDOM = new SecureRandom();

    private final TuitionInvoiceRepository invoiceRepository;
    private final TuitionReceiptRepository receiptRepository;
    private final WalletService walletService;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public TuitionService(
            TuitionInvoiceRepository invoiceRepository,
            TuitionReceiptRepository receiptRepository,
            WalletService walletService,
            LedgerEntryRepository ledgerEntryRepository,
            UserRepository userRepository,
            ApplicationEventPublisher eventPublisher
    ) {
        this.invoiceRepository = invoiceRepository;
        this.receiptRepository = receiptRepository;
        this.walletService = walletService;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    @Transactional(readOnly = true)
    public List<TuitionInvoiceResponse> getStudentInvoices(UUID studentId) {
        return invoiceRepository.findByStudentIdOrderByDueDateAsc(studentId)
                .stream()
                .map(TuitionInvoiceResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public TuitionInvoiceResponse getInvoiceDetails(UUID invoiceId) {
        TuitionInvoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Tuition invoice not found: " + invoiceId));
        return TuitionInvoiceResponse.fromEntity(invoice);
    }

    @Transactional
    public TuitionReceiptResponse payTuition(UUID studentId, PayTuitionRequest request) {
        Objects.requireNonNull(request, "PayTuitionRequest cannot be null");
        BigDecimal amount = request.amount().setScale(2, RoundingMode.HALF_UP);

        TuitionInvoice invoice = invoiceRepository.findById(request.invoiceId())
                .orElseThrow(() -> new ResourceNotFoundException("Tuition invoice not found: " + request.invoiceId()));

        if (!invoice.getStudent().getId().equals(studentId)) {
            throw new IllegalArgumentException("Invoice does not belong to the authenticated student account.");
        }

        BigDecimal remaining = invoice.getRemainingAmount();
        if (amount.compareTo(remaining) > 0) {
            throw new IllegalArgumentException(String.format(
                    "Settlement payment amount %s SAR exceeds remaining invoice balance %s SAR", amount, remaining
            ));
        }

        // 1. Debit student digital wallet via atomic WalletService
        String description = "Tuition fee payment for invoice " + invoice.getInvoiceNumber();
        walletService.debit(
                studentId,
                amount,
                TransactionType.TUITION_PAYMENT,
                request.idempotencyKey(),
                invoice.getInvoiceNumber(),
                description
        );

        // 2. Apply settlement to invoice
        invoice.applyPayment(amount);
        TuitionInvoice savedInvoice = invoiceRepository.save(invoice);

        // 3. Find created ledger audit entry
        LedgerEntry ledgerEntry = ledgerEntryRepository.findByIdempotencyKey(request.idempotencyKey())
                .orElseThrow(() -> new IllegalStateException("Ledger entry not found for processed tuition payment."));

        // 4. Generate unique official receipt number and cryptographic QR code
        int rctNum = 100000 + RANDOM.nextInt(900000);
        String receiptNumber = "FBSU-RCT-2026-" + rctNum;
        String verificationCode = "FBSU-VERIFY-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found: " + studentId));

        TuitionReceipt receipt = new TuitionReceipt(
                savedInvoice,
                receiptNumber,
                amount,
                ledgerEntry,
                student,
                "DIGITAL_WALLET",
                verificationCode
        );

        TuitionReceipt savedReceipt = receiptRepository.save(receipt);

        log.info("Tuition settlement finalized: Receipt {} issued for student {} [{} SAR, Invoice {}]",
                receiptNumber, student.getUniversityNumber(), amount, savedInvoice.getInvoiceNumber());

        eventPublisher.publishEvent(new WalletTransactionEvent(
                studentId,
                student.getUniversityId(),
                amount,
                "TUITION_PAYMENT",
                savedInvoice.getInvoiceNumber()
        ));

        return TuitionReceiptResponse.fromEntity(savedReceipt);
    }

    @Transactional(readOnly = true)
    public List<TuitionReceiptResponse> getStudentReceipts(UUID studentId) {
        return receiptRepository.findByPayerIdOrderByCreatedAtDesc(studentId)
                .stream()
                .map(TuitionReceiptResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public TuitionReceiptResponse getReceiptDetails(UUID receiptId) {
        TuitionReceipt receipt = receiptRepository.findById(receiptId)
                .orElseThrow(() -> new ResourceNotFoundException("Tuition receipt not found: " + receiptId));
        return TuitionReceiptResponse.fromEntity(receipt);
    }
}

