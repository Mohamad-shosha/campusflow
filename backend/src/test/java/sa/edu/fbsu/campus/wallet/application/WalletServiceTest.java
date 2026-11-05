package sa.edu.fbsu.campus.wallet.application;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserType;
import sa.edu.fbsu.campus.identity.infra.UserRepository;
import sa.edu.fbsu.campus.wallet.domain.*;
import sa.edu.fbsu.campus.wallet.dto.TopUpRequest;
import sa.edu.fbsu.campus.wallet.dto.TransferRequest;
import sa.edu.fbsu.campus.wallet.dto.WalletResponse;
import sa.edu.fbsu.campus.wallet.infra.LedgerEntryRepository;
import sa.edu.fbsu.campus.wallet.infra.WalletRepository;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("WalletService Unit & Business Rules Tests (P4-02)")
class WalletServiceTest {

    @Mock
    private WalletRepository walletRepository;

    @Mock
    private LedgerEntryRepository ledgerEntryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WalletService walletService;

    private UUID universityId;
    private User sender;
    private User recipient;
    private Wallet senderWallet;
    private Wallet recipientWallet;

    @BeforeEach
    void setUp() {
        universityId = UUID.randomUUID();

        sender = new User(universityId, "202410101", "sender@fbsu.edu.sa", "pass", "المرسل", "Sender", UserType.STUDENT);
        sender.setId(UUID.randomUUID());

        recipient = new User(universityId, "202410102", "recipient@fbsu.edu.sa", "pass", "المستلم", "Recipient", UserType.STUDENT);
        recipient.setId(UUID.randomUUID());

        senderWallet = new Wallet(universityId, sender, new BigDecimal("500.00"), "SAR");
        senderWallet.setId(UUID.randomUUID());

        recipientWallet = new Wallet(universityId, recipient, new BigDecimal("100.00"), "SAR");
        recipientWallet.setId(UUID.randomUUID());
    }

    @Test
    @DisplayName("topUp should credit wallet and record ledger entry when idempotency key is fresh")
    void testTopUpSuccess() {
        when(ledgerEntryRepository.existsByIdempotencyKey("idem-topup-01")).thenReturn(false);
        when(walletRepository.findByUserIdForUpdate(sender.getId())).thenReturn(Optional.of(senderWallet));
        when(walletRepository.save(any(Wallet.class))).thenAnswer(inv -> inv.getArgument(0));

        TopUpRequest req = new TopUpRequest(new BigDecimal("150.00"), "idem-topup-01", "MADA", "Top up funds");
        WalletResponse resp = walletService.topUp(sender.getId(), req);

        assertThat(resp.balance()).isEqualByComparingTo("650.00");
        verify(ledgerEntryRepository, times(1)).save(any(LedgerEntry.class));
    }

    @Test
    @DisplayName("topUp should return current wallet without double-credit if idempotency key exists")
    void testTopUpIdempotent() {
        when(ledgerEntryRepository.existsByIdempotencyKey("idem-duplicate")).thenReturn(true);
        when(walletRepository.findByUserId(sender.getId())).thenReturn(Optional.of(senderWallet));

        TopUpRequest req = new TopUpRequest(new BigDecimal("100.00"), "idem-duplicate", "MADA", "Duplicate");
        WalletResponse resp = walletService.topUp(sender.getId(), req);

        assertThat(resp.balance()).isEqualByComparingTo("500.00");
        verify(walletRepository, never()).findByUserIdForUpdate(any());
        verify(ledgerEntryRepository, never()).save(any());
    }

    @Test
    @DisplayName("transfer should move funds atomically between sender and recipient")
    void testTransferSuccess() {
        when(ledgerEntryRepository.existsByIdempotencyKey("idem-trans-01")).thenReturn(false);
        when(userRepository.findByUniversityNumber("202410102")).thenReturn(Optional.of(recipient));

        when(walletRepository.findByUserIdForUpdate(sender.getId())).thenReturn(Optional.of(senderWallet));
        when(walletRepository.findByUserIdForUpdate(recipient.getId())).thenReturn(Optional.of(recipientWallet));
        when(walletRepository.findByUserId(sender.getId())).thenReturn(Optional.of(senderWallet));
        when(walletRepository.findByUserId(recipient.getId())).thenReturn(Optional.of(recipientWallet));

        TransferRequest req = new TransferRequest("202410102", new BigDecimal("75.00"), "idem-trans-01", "Study session");
        WalletResponse senderResp = walletService.transfer(sender.getId(), req);

        assertThat(senderResp.balance()).isEqualByComparingTo("425.00");
        assertThat(recipientWallet.getBalance()).isEqualByComparingTo("175.00");

        verify(walletRepository, times(1)).save(senderWallet);
        verify(walletRepository, times(1)).save(recipientWallet);
        verify(ledgerEntryRepository, times(2)).save(any(LedgerEntry.class)); // Debit and credit entries
    }

    @Test
    @DisplayName("transfer should fail when sender has insufficient balance")
    void testTransferInsufficientBalance() {
        when(ledgerEntryRepository.existsByIdempotencyKey("idem-fail")).thenReturn(false);
        when(userRepository.findByUniversityNumber("202410102")).thenReturn(Optional.of(recipient));
        when(walletRepository.findByUserIdForUpdate(sender.getId())).thenReturn(Optional.of(senderWallet));
        when(walletRepository.findByUserIdForUpdate(recipient.getId())).thenReturn(Optional.of(recipientWallet));
        when(walletRepository.findByUserId(sender.getId())).thenReturn(Optional.of(senderWallet));
        when(walletRepository.findByUserId(recipient.getId())).thenReturn(Optional.of(recipientWallet));

        TransferRequest req = new TransferRequest("202410102", new BigDecimal("900.00"), "idem-fail", "Too much");

        assertThatThrownBy(() -> walletService.transfer(sender.getId(), req))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Insufficient wallet balance");
    }

    @Test
    @DisplayName("transfer should reject self-transfer")
    void testTransferSelfTransfer() {
        when(ledgerEntryRepository.existsByIdempotencyKey("idem-self")).thenReturn(false);
        when(userRepository.findByUniversityNumber("202410101")).thenReturn(Optional.of(sender));

        TransferRequest req = new TransferRequest("202410101", new BigDecimal("50.00"), "idem-self", "To self");

        assertThatThrownBy(() -> walletService.transfer(sender.getId(), req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Cannot transfer funds to your own wallet");
    }
}
