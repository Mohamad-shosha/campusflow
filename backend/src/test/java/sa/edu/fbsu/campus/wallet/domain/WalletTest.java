package sa.edu.fbsu.campus.wallet.domain;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import sa.edu.fbsu.campus.identity.domain.User;
import sa.edu.fbsu.campus.identity.domain.UserType;

import java.math.BigDecimal;
import java.util.UUID;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Wallet Domain Model Tests (P4-01)")
class WalletTest {

    private UUID universityId;
    private User testUser;
    private Wallet wallet;

    @BeforeEach
    void setUp() {
        universityId = UUID.randomUUID();
        testUser = new User(
                universityId,
                "202410101",
                "student@fbsu.edu.sa",
                "hashedPass",
                "أحمد العطوي",
                "Ahmed Al-Atwi",
                UserType.STUDENT
        );
        wallet = new Wallet(universityId, testUser, new BigDecimal("500.00"), "SAR");
    }

    @Test
    @DisplayName("Should initialize wallet with correct balance and active status")
    void testWalletInitialization() {
        assertThat(wallet.getBalance()).isEqualByComparingTo("500.00");
        assertThat(wallet.getCurrency()).isEqualTo("SAR");
        assertThat(wallet.getStatus()).isEqualTo(WalletStatus.ACTIVE);
        assertThat(wallet.getUser()).isEqualTo(testUser);
    }

    @Test
    @DisplayName("Should credit amount to active wallet successfully")
    void testCreditSuccess() {
        wallet.credit(new BigDecimal("150.50"));
        assertThat(wallet.getBalance()).isEqualByComparingTo("650.50");
    }

    @Test
    @DisplayName("Should reject non-positive credit amounts")
    void testCreditNonPositiveAmount() {
        assertThatThrownBy(() -> wallet.credit(BigDecimal.ZERO))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("strictly positive");

        assertThatThrownBy(() -> wallet.credit(new BigDecimal("-10.00")))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Should debit amount from active wallet when sufficient balance exists")
    void testDebitSuccess() {
        wallet.debit(new BigDecimal("200.00"));
        assertThat(wallet.getBalance()).isEqualByComparingTo("300.00");
    }

    @Test
    @DisplayName("Should reject debit when requested amount exceeds available balance")
    void testDebitInsufficientBalance() {
        assertThatThrownBy(() -> wallet.debit(new BigDecimal("600.00")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Insufficient wallet balance");
    }

    @Test
    @DisplayName("Should reject credit and debit when wallet is frozen")
    void testOperationsOnFrozenWallet() {
        wallet.setStatus(WalletStatus.FROZEN);

        assertThatThrownBy(() -> wallet.credit(new BigDecimal("50.00")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("non-active status");

        assertThatThrownBy(() -> wallet.debit(new BigDecimal("50.00")))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("non-active status");
    }
}
