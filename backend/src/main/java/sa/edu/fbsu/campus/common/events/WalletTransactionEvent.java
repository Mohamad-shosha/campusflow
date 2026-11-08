package sa.edu.fbsu.campus.common.events;

import java.math.BigDecimal;
import java.util.UUID;

public record WalletTransactionEvent(
        UUID recipientUserId,
        UUID universityId,
        BigDecimal amount,
        String type, // "TOP_UP", "TRANSFER_IN", "TRANSFER_OUT", "TUITION_PAYMENT", "FLEX_REWARD"
        String reference
) {
}
