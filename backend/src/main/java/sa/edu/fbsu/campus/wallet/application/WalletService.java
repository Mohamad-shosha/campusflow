package sa.edu.fbsu.campus.wallet.application;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.common.error.ResourceNotFoundException;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.wallet.domain.*;
import sa.edu.fbsu.campus.wallet.dto.*;
import sa.edu.fbsu.campus.wallet.infra.LedgerEntryRepository;
import sa.edu.fbsu.campus.wallet.infra.WalletRepository;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Objects;
import java.util.UUID;

@Service
public class WalletService {

    private static final Logger log = LoggerFactory.getLogger(WalletService.class);

    private final WalletRepository walletRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final UserRepository userRepository;

    public WalletService(
            WalletRepository walletRepository,
            LedgerEntryRepository ledgerEntryRepository,
            UserRepository userRepository
    ) {
        this.walletRepository = walletRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Wallet getOrCreateWallet(UUID userId) {
        return walletRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));
            Wallet newWallet = new Wallet(user.getUniversityId(), user, BigDecimal.ZERO, "SAR");
            log.info("Initialized new digital wallet for user {} [{}]", user.getUniversityNumber(), userId);
            return walletRepository.save(newWallet);
        });
    }

    @Transactional(readOnly = true)
    public WalletResponse getWalletResponse(UUID userId) {
        Wallet wallet = getOrCreateWallet(userId);
        return WalletResponse.fromEntity(wallet);
    }

    @Transactional
    public WalletResponse topUp(UUID userId, TopUpRequest request) {
        Objects.requireNonNull(request, "TopUpRequest cannot be null");
        BigDecimal amount = request.amount().setScale(2, RoundingMode.HALF_UP);

        // 1. Idempotency Check
        if (ledgerEntryRepository.existsByIdempotencyKey(request.idempotencyKey())) {
            log.warn("Idempotency key '{}' already processed for top-up. Returning existing wallet state.", request.idempotencyKey());
            return getWalletResponse(userId);
        }

        // 2. Lock wallet row for update
        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseGet(() -> getOrCreateWallet(userId));

        // 3. Credit wallet balance
        wallet.credit(amount);
        Wallet savedWallet = walletRepository.save(wallet);

        // 4. Append immutable ledger audit entry
        String desc = (request.description() != null && !request.description().isBlank())
                ? request.description()
                : "Digital wallet balance top-up (" + (request.paymentMethod() != null ? request.paymentMethod() : "MADA") + ")";

        LedgerEntry entry = new LedgerEntry(
                savedWallet,
                TransactionType.TOP_UP,
                TransactionDirection.CREDIT,
                amount,
                savedWallet.getBalance(),
                request.idempotencyKey(),
                request.paymentMethod() != null ? request.paymentMethod() : "DIRECT_TOPUP",
                desc
        );
        ledgerEntryRepository.save(entry);

        log.info("Wallet top-up successful: {} SAR credited to user {}, new balance: {} SAR",
                amount, userId, savedWallet.getBalance());

        return WalletResponse.fromEntity(savedWallet);
    }

    @Transactional
    public WalletResponse debit(
            UUID userId,
            BigDecimal amount,
            TransactionType type,
            String idempotencyKey,
            String referenceId,
            String description
    ) {
        Objects.requireNonNull(amount, "Debit amount cannot be null");
        Objects.requireNonNull(type, "TransactionType cannot be null");
        Objects.requireNonNull(idempotencyKey, "IdempotencyKey cannot be null");

        BigDecimal debitAmount = amount.setScale(2, RoundingMode.HALF_UP);

        // 1. Idempotency Check
        if (ledgerEntryRepository.existsByIdempotencyKey(idempotencyKey)) {
            log.warn("Idempotency key '{}' already processed for debit. Returning current wallet state.", idempotencyKey);
            return getWalletResponse(userId);
        }

        // 2. Lock wallet row for update
        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for user: " + userId));

        // 3. Debit wallet balance
        wallet.debit(debitAmount);
        Wallet savedWallet = walletRepository.save(wallet);

        // 4. Append immutable ledger audit entry
        LedgerEntry entry = new LedgerEntry(
                savedWallet,
                type,
                TransactionDirection.DEBIT,
                debitAmount,
                savedWallet.getBalance(),
                idempotencyKey,
                referenceId,
                description
        );
        ledgerEntryRepository.save(entry);

        log.info("Wallet debit successful: {} SAR debited from user {} for {}, new balance: {} SAR",
                debitAmount, userId, type, savedWallet.getBalance());

        return WalletResponse.fromEntity(savedWallet);
    }

    @Transactional
    public WalletResponse refund(
            UUID userId,
            BigDecimal amount,
            String idempotencyKey,
            String referenceId,
            String description
    ) {
        Objects.requireNonNull(amount, "Refund amount cannot be null");
        Objects.requireNonNull(idempotencyKey, "IdempotencyKey cannot be null");

        BigDecimal refundAmount = amount.setScale(2, RoundingMode.HALF_UP);

        if (ledgerEntryRepository.existsByIdempotencyKey(idempotencyKey)) {
            log.warn("Idempotency key '{}' already processed for refund. Returning current wallet state.", idempotencyKey);
            return getWalletResponse(userId);
        }

        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseGet(() -> getOrCreateWallet(userId));

        wallet.credit(refundAmount);
        Wallet savedWallet = walletRepository.save(wallet);

        LedgerEntry entry = new LedgerEntry(
                savedWallet,
                TransactionType.REFUND,
                TransactionDirection.CREDIT,
                refundAmount,
                savedWallet.getBalance(),
                idempotencyKey,
                referenceId,
                description
        );
        ledgerEntryRepository.save(entry);

        log.info("Wallet refund successful: {} SAR credited to user {}, new balance: {} SAR",
                refundAmount, userId, savedWallet.getBalance());

        return WalletResponse.fromEntity(savedWallet);
    }

    @Transactional
    public WalletResponse transfer(UUID senderUserId, TransferRequest request) {
        Objects.requireNonNull(request, "TransferRequest cannot be null");
        BigDecimal amount = request.amount().setScale(2, RoundingMode.HALF_UP);

        // 1. Idempotency Check
        if (ledgerEntryRepository.existsByIdempotencyKey(request.idempotencyKey())) {
            log.warn("Idempotency key '{}' already processed for transfer. Returning sender wallet state.", request.idempotencyKey());
            return getWalletResponse(senderUserId);
        }

        // 2. Find recipient user
        String recipientIden = request.recipientIdentifier().trim();
        User recipient = userRepository.findByUniversityNumber(recipientIden)
                .or(() -> userRepository.findByEmail(recipientIden))
                .orElseThrow(() -> new ResourceNotFoundException("Recipient member not found: " + recipientIden));

        if (recipient.getId().equals(senderUserId)) {
            throw new IllegalArgumentException("Cannot transfer funds to your own wallet.");
        }

        // 3. Deadlock prevention: deterministic lock order by UUID
        UUID firstLockId = senderUserId.compareTo(recipient.getId()) < 0 ? senderUserId : recipient.getId();
        UUID secondLockId = senderUserId.compareTo(recipient.getId()) < 0 ? recipient.getId() : senderUserId;

        walletRepository.findByUserIdForUpdate(firstLockId).orElseGet(() -> getOrCreateWallet(firstLockId));
        walletRepository.findByUserIdForUpdate(secondLockId).orElseGet(() -> getOrCreateWallet(secondLockId));

        Wallet senderWallet = getOrCreateWallet(senderUserId);
        Wallet recipientWallet = getOrCreateWallet(recipient.getId());

        // 4. Verify sender balance and execute transfer
        senderWallet.debit(amount);
        recipientWallet.credit(amount);

        walletRepository.save(senderWallet);
        walletRepository.save(recipientWallet);

        // 5. Append sender DEBIT ledger entry
        String senderDesc = (request.description() != null && !request.description().isBlank())
                ? request.description()
                : "Transfer to " + recipient.getFullNameEn() + " (" + recipient.getUniversityNumber() + ")";

        LedgerEntry senderEntry = new LedgerEntry(
                senderWallet,
                TransactionType.PEER_TRANSFER,
                TransactionDirection.DEBIT,
                amount,
                senderWallet.getBalance(),
                request.idempotencyKey(),
                recipient.getUniversityNumber(),
                senderDesc
        );
        ledgerEntryRepository.save(senderEntry);

        // 6. Append recipient CREDIT ledger entry
        User sender = senderWallet.getUser();
        String recvIdempotencyKey = request.idempotencyKey() + "-recv";
        String recvDesc = "Received from " + sender.getFullNameEn() + " (" + sender.getUniversityNumber() + ")";

        LedgerEntry recipientEntry = new LedgerEntry(
                recipientWallet,
                TransactionType.PEER_TRANSFER,
                TransactionDirection.CREDIT,
                amount,
                recipientWallet.getBalance(),
                recvIdempotencyKey,
                sender.getUniversityNumber(),
                recvDesc
        );
        ledgerEntryRepository.save(recipientEntry);

        log.info("P2P transfer completed: {} SAR from {} to {}",
                amount, sender.getUniversityNumber(), recipient.getUniversityNumber());

        return WalletResponse.fromEntity(senderWallet);
    }

    @Transactional(readOnly = true)
    public Page<LedgerEntryResponse> getLedgerHistory(UUID userId, Pageable pageable) {
        Wallet wallet = getOrCreateWallet(userId);
        return ledgerEntryRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId(), pageable)
                .map(LedgerEntryResponse::fromEntity);
    }
}
