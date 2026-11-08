package sa.edu.fbsu.campus.wallet.tuition.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import sa.edu.fbsu.campus.domain.AcademicTerm;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.wallet.application.WalletService;
import sa.edu.fbsu.campus.wallet.domain.LedgerEntry;
import sa.edu.fbsu.campus.wallet.domain.TransactionDirection;
import sa.edu.fbsu.campus.wallet.domain.TransactionType;
import sa.edu.fbsu.campus.wallet.domain.Wallet;
import sa.edu.fbsu.campus.wallet.infra.LedgerEntryRepository;
import sa.edu.fbsu.campus.wallet.tuition.domain.InvoiceStatus;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionInvoice;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionReceipt;
import sa.edu.fbsu.campus.wallet.tuition.dto.PayTuitionRequest;
import sa.edu.fbsu.campus.wallet.tuition.dto.TuitionInvoiceResponse;
import sa.edu.fbsu.campus.wallet.tuition.dto.TuitionReceiptResponse;
import sa.edu.fbsu.campus.wallet.tuition.infra.TuitionInvoiceRepository;
import sa.edu.fbsu.campus.wallet.tuition.infra.TuitionReceiptRepository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("TuitionService Unit & Settlement Payment Tests (P4-03)")
class TuitionServiceTest {

    @Mock
    private TuitionInvoiceRepository invoiceRepository;

    @Mock
    private TuitionReceiptRepository receiptRepository;

    @Mock
    private WalletService walletService;

    @Mock
    private LedgerEntryRepository ledgerEntryRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @InjectMocks
    private TuitionService tuitionService;

    private UUID universityId;
    private User student;
    private AcademicTerm term;
    private TuitionInvoice invoice;
    private Wallet wallet;
    private LedgerEntry ledgerEntry;

    @BeforeEach
    void setUp() {
        universityId = UUID.randomUUID();

        student = new User(universityId, "STD-202410101", "student@fbsu.edu.sa", "hash", "أحمد", "Ahmed", UserType.STUDENT);
        student.setId(UUID.randomUUID());

        term = new AcademicTerm(universityId, "2026-FALL", "خريف 2026", "Fall 2026",
                LocalDate.of(2026, 9, 1), LocalDate.of(2027, 1, 15), true);
        term.setId(UUID.randomUUID());

        invoice = new TuitionInvoice(universityId, student, term, "INV-2026-CCIS-001", new BigDecimal("1200.00"), LocalDate.of(2026, 11, 30));
        invoice.setId(UUID.randomUUID());

        wallet = new Wallet(universityId, student, new BigDecimal("2000.00"), "SAR");
        wallet.setId(UUID.randomUUID());

        ledgerEntry = new LedgerEntry(wallet, TransactionType.TUITION_PAYMENT, TransactionDirection.DEBIT,
                new BigDecimal("500.00"), new BigDecimal("1500.00"), "idem-tuition-1", "INV-2026-CCIS-001", "Tuition Payment");
    }

    @Test
    @DisplayName("Successfully pays partial tuition invoice and generates verified receipt")
    void payTuition_partial_success() {
        PayTuitionRequest request = new PayTuitionRequest(
                invoice.getId(),
                new BigDecimal("500.00"),
                "idem-tuition-1"
        );

        when(invoiceRepository.findById(invoice.getId())).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(TuitionInvoice.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(ledgerEntryRepository.findByIdempotencyKey("idem-tuition-1")).thenReturn(Optional.of(ledgerEntry));
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(receiptRepository.save(any(TuitionReceipt.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TuitionReceiptResponse receipt = tuitionService.payTuition(student.getId(), request);

        assertThat(receipt).isNotNull();
        assertThat(receipt.amountPaid()).isEqualByComparingTo("500.00");
        assertThat(receipt.paymentMethod()).isEqualTo("DIGITAL_WALLET");
        assertThat(receipt.receiptNumber()).startsWith("FBSU-RCT-2026-");
        assertThat(receipt.verificationCode()).startsWith("FBSU-VERIFY-");
        assertThat(invoice.getStatus()).isEqualTo(InvoiceStatus.PARTIALLY_PAID);
        assertThat(invoice.getRemainingAmount()).isEqualByComparingTo("700.00");

        verify(walletService).debit(
                eq(student.getId()),
                eq(new BigDecimal("500.00")),
                eq(TransactionType.TUITION_PAYMENT),
                eq("idem-tuition-1"),
                eq(invoice.getInvoiceNumber()),
                anyString()
        );
    }

    @Test
    @DisplayName("Successfully settles full tuition invoice marking status PAID")
    void payTuition_fullSettlement_marksPaid() {
        PayTuitionRequest request = new PayTuitionRequest(
                invoice.getId(),
                new BigDecimal("1200.00"),
                "idem-tuition-full"
        );

        when(invoiceRepository.findById(invoice.getId())).thenReturn(Optional.of(invoice));
        when(invoiceRepository.save(any(TuitionInvoice.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(ledgerEntryRepository.findByIdempotencyKey("idem-tuition-full")).thenReturn(Optional.of(ledgerEntry));
        when(userRepository.findById(student.getId())).thenReturn(Optional.of(student));
        when(receiptRepository.save(any(TuitionReceipt.class))).thenAnswer(invocation -> invocation.getArgument(0));

        TuitionReceiptResponse receipt = tuitionService.payTuition(student.getId(), request);

        assertThat(receipt).isNotNull();
        assertThat(invoice.getStatus()).isEqualTo(InvoiceStatus.PAID);
        assertThat(invoice.getRemainingAmount()).isEqualByComparingTo("0.00");
    }

    @Test
    @DisplayName("Rejects tuition payment if amount exceeds remaining invoice balance")
    void payTuition_exceedsRemaining_throwsException() {
        PayTuitionRequest request = new PayTuitionRequest(
                invoice.getId(),
                new BigDecimal("1500.00"),
                "idem-tuition-over"
        );

        when(invoiceRepository.findById(invoice.getId())).thenReturn(Optional.of(invoice));

        assertThatThrownBy(() -> tuitionService.payTuition(student.getId(), request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("exceeds remaining invoice balance");

        verify(walletService, never()).debit(any(), any(), any(), any(), any(), any());
    }

    @Test
    @DisplayName("Rejects tuition payment if invoice belongs to a different student")
    void payTuition_unauthorizedStudent_throwsException() {
        UUID otherStudentId = UUID.randomUUID();
        PayTuitionRequest request = new PayTuitionRequest(
                invoice.getId(),
                new BigDecimal("100.00"),
                "idem-tuition-other"
        );

        when(invoiceRepository.findById(invoice.getId())).thenReturn(Optional.of(invoice));

        assertThatThrownBy(() -> tuitionService.payTuition(otherStudentId, request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("does not belong to the authenticated student account");
    }

    @Test
    @DisplayName("Lists student invoices correctly")
    void getStudentInvoices_returnsMappedList() {
        when(invoiceRepository.findByStudentIdOrderByDueDateAsc(student.getId()))
                .thenReturn(List.of(invoice));

        List<TuitionInvoiceResponse> invoices = tuitionService.getStudentInvoices(student.getId());

        assertThat(invoices).hasSize(1);
        assertThat(invoices.get(0).invoiceNumber()).isEqualTo("INV-2026-CCIS-001");
        assertThat(invoices.get(0).totalAmount()).isEqualByComparingTo("1200.00");
    }
}
