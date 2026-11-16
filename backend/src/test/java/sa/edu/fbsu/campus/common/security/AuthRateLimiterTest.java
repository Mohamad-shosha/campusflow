package sa.edu.fbsu.campus.common.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneOffset;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DisplayName("AuthRateLimiter brute-force protection (P8-01)")
class AuthRateLimiterTest {

    /** Mutable clock so tests can move time forward. */
    private static final class TestClock extends Clock {
        private Instant now = Instant.parse("2026-11-16T08:00:00Z");

        @Override public ZoneOffset getZone() { return ZoneOffset.UTC; }
        @Override public Clock withZone(java.time.ZoneId zone) { return this; }
        @Override public Instant instant() { return now; }
        void advance(Duration d) { now = now.plus(d); }
    }

    private final TestClock clock = new TestClock();
    private final AuthRateLimiter limiter = new AuthRateLimiter(
            clock, 3, 5, Duration.ofMinutes(15), 2, Duration.ofHours(1));

    @Test
    @DisplayName("Locks an account after the configured number of failures, with Retry-After")
    void locksAccountAfterFailures() {
        for (int i = 0; i < 3; i++) {
            limiter.checkLogin("1.1.1.1", "fbsu:victim");
            limiter.recordLoginFailure("1.1.1.1", "fbsu:victim");
        }
        assertThatThrownBy(() -> limiter.checkLogin("2.2.2.2", "fbsu:victim"))
                .isInstanceOf(TooManyRequestsException.class)
                .satisfies(ex -> assertThat(((TooManyRequestsException) ex).getRetryAfterSeconds())
                        .isBetween(1L, 900L));
        // Other accounts from a different IP are unaffected
        assertThatCode(() -> limiter.checkLogin("2.2.2.2", "fbsu:someone-else")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Lock expires after the window passes")
    void lockExpires() {
        for (int i = 0; i < 3; i++) {
            limiter.recordLoginFailure("1.1.1.1", "fbsu:victim");
        }
        clock.advance(Duration.ofMinutes(16));
        assertThatCode(() -> limiter.checkLogin("1.1.1.1", "fbsu:victim")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Successful login clears the account counter")
    void successResetsAccount() {
        limiter.recordLoginFailure("1.1.1.1", "fbsu:user");
        limiter.recordLoginFailure("1.1.1.1", "fbsu:user");
        limiter.recordLoginSuccess("fbsu:user");
        limiter.recordLoginFailure("1.1.1.1", "fbsu:user");
        assertThatCode(() -> limiter.checkLogin("9.9.9.9", "fbsu:user")).doesNotThrowAnyException();
    }

    @Test
    @DisplayName("Blocks an IP spraying passwords across many accounts")
    void blocksPasswordSprayingIp() {
        for (int i = 0; i < 5; i++) {
            limiter.recordLoginFailure("6.6.6.6", "fbsu:account-" + i);
        }
        assertThatThrownBy(() -> limiter.checkLogin("6.6.6.6", "fbsu:fresh-account"))
                .isInstanceOf(TooManyRequestsException.class);
    }

    @Test
    @DisplayName("Limits registrations per IP")
    void limitsRegistrations() {
        limiter.checkAndRecordRegistration("3.3.3.3");
        limiter.checkAndRecordRegistration("3.3.3.3");
        assertThatThrownBy(() -> limiter.checkAndRecordRegistration("3.3.3.3"))
                .isInstanceOf(TooManyRequestsException.class);
        assertThatCode(() -> limiter.checkAndRecordRegistration("4.4.4.4")).doesNotThrowAnyException();
    }
}
