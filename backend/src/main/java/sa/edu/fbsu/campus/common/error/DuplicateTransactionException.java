package sa.edu.fbsu.campus.common.error;

/**
 * Raised when a caller-supplied idempotency key has already been used for a ledger entry.
 * Money-moving operations must never silently "succeed" on a replayed key, because the caller
 * would then apply its own side effects (mark an invoice paid, enrol a student) without a debit.
 */
public class DuplicateTransactionException extends RuntimeException {
    private static final long serialVersionUID = 1L;

    public DuplicateTransactionException(String message) {
        super(message);
    }
}
