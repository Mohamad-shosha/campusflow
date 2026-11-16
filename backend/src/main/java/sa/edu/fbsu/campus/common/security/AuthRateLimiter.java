package sa.edu.fbsu.campus.common.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory sliding-window limiter for the public authentication endpoints (OWASP ASVS V2.2.1).
 *
 * <p>Login and refresh count only <em>failed</em> attempts, per client IP and per account, so normal
 * users are never throttled. Registration counts every attempt per IP. State is per instance; a
 * multi-instance deployment needs a shared store (see docs/security/security-review.md).
 */
@Component
public class AuthRateLimiter {

    private static final int MAX_TRACKED_KEYS = 50_000;

    private final Map<String, Deque<Instant>> attempts = new ConcurrentHashMap<>();
    private final Clock clock;
    private final int maxFailuresPerAccount;
    private final int maxFailuresPerIp;
    private final Duration failureWindow;
    private final int maxRegistrationsPerIp;
    private final Duration registrationWindow;

    @org.springframework.beans.factory.annotation.Autowired
    public AuthRateLimiter(
            @Value("${app.security.rate-limit.login.max-failures-per-account:5}") int maxFailuresPerAccount,
            @Value("${app.security.rate-limit.login.max-failures-per-ip:20}") int maxFailuresPerIp,
            @Value("${app.security.rate-limit.login.window:PT15M}") Duration failureWindow,
            @Value("${app.security.rate-limit.register.max-per-ip:10}") int maxRegistrationsPerIp,
            @Value("${app.security.rate-limit.register.window:PT1H}") Duration registrationWindow) {
        this(Clock.systemUTC(), maxFailuresPerAccount, maxFailuresPerIp, failureWindow,
                maxRegistrationsPerIp, registrationWindow);
    }

    AuthRateLimiter(Clock clock, int maxFailuresPerAccount, int maxFailuresPerIp, Duration failureWindow,
                    int maxRegistrationsPerIp, Duration registrationWindow) {
        this.clock = clock;
        this.maxFailuresPerAccount = maxFailuresPerAccount;
        this.maxFailuresPerIp = maxFailuresPerIp;
        this.failureWindow = failureWindow;
        this.maxRegistrationsPerIp = maxRegistrationsPerIp;
        this.registrationWindow = registrationWindow;
    }

    /** Throws {@link TooManyRequestsException} if this IP or account has too many recent failures. */
    public void checkLogin(String clientIp, String accountKey) {
        check(ipKey(clientIp), maxFailuresPerIp, failureWindow);
        if (accountKey != null) {
            check(accountKey(accountKey), maxFailuresPerAccount, failureWindow);
        }
    }

    public void recordLoginFailure(String clientIp, String accountKey) {
        record(ipKey(clientIp));
        if (accountKey != null) {
            record(accountKey(accountKey));
        }
    }

    public void recordLoginSuccess(String accountKey) {
        if (accountKey != null) {
            attempts.remove(accountKey(accountKey));
        }
    }

    /** Checks and counts one registration attempt for this IP. */
    public void checkAndRecordRegistration(String clientIp) {
        String key = "reg:" + clientIp;
        check(key, maxRegistrationsPerIp, registrationWindow);
        record(key);
    }

    private void check(String key, int max, Duration window) {
        Deque<Instant> deque = attempts.get(key);
        if (deque == null) {
            return;
        }
        synchronized (deque) {
            prune(deque, window);
            if (deque.size() >= max) {
                Instant retryAt = deque.peekFirst().plus(window);
                long retryAfter = Math.max(1, Duration.between(clock.instant(), retryAt).toSeconds());
                throw new TooManyRequestsException(retryAfter);
            }
        }
    }

    private void record(String key) {
        if (attempts.size() > MAX_TRACKED_KEYS) {
            evictStale();
        }
        Deque<Instant> deque = attempts.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (deque) {
            deque.addLast(clock.instant());
        }
    }

    private void prune(Deque<Instant> deque, Duration window) {
        Instant cutoff = clock.instant().minus(window);
        while (!deque.isEmpty() && deque.peekFirst().isBefore(cutoff)) {
            deque.pollFirst();
        }
    }

    private void evictStale() {
        Duration longest = failureWindow.compareTo(registrationWindow) > 0 ? failureWindow : registrationWindow;
        attempts.entrySet().removeIf(e -> {
            synchronized (e.getValue()) {
                prune(e.getValue(), longest);
                return e.getValue().isEmpty();
            }
        });
    }

    private static String ipKey(String ip) {
        return "ip:" + ip;
    }

    private static String accountKey(String account) {
        return "acct:" + account;
    }
}
