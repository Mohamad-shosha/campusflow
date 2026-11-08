package sa.edu.fbsu.campus.common.events;

import java.util.UUID;

public record GateAccessEvent(
        UUID recipientUserId,
        UUID universityId,
        String plateText,
        String gateNameAr,
        String gateNameEn,
        boolean isEntry
) {
}
