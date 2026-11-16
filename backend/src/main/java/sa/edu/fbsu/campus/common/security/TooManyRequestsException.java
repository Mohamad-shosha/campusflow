package sa.edu.fbsu.campus.common.security;

/** Raised by {@link AuthRateLimiter}; mapped to HTTP 429 with a Retry-After header. */
public class TooManyRequestsException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    private final long retryAfterSeconds;

    public TooManyRequestsException(long retryAfterSeconds) {
        super("Too many attempts. Try again later.");
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
