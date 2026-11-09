package sa.edu.fbsu.campus.parking.dto;

import sa.edu.fbsu.campus.parking.domain.GateEventLog;

import java.time.Instant;
import java.util.UUID;

/** One recorded gate scan decision from {@code gate_event_log}. */
public record GateEventResponse(
        UUID id,
        String gateId,
        String plateLettersAr,
        String plateDigits,
        String decision,
        String reason,
        Integer bayNumber,
        String bayCode,
        Instant occurredAt
) {
    public static GateEventResponse fromEntity(GateEventLog e) {
        return new GateEventResponse(
                e.getId(),
                e.getGateId(),
                e.getPlateLettersAr(),
                e.getPlateDigits(),
                e.getDecision(),
                e.getReason(),
                e.getBayNumber(),
                e.getBayCode(),
                e.getCreatedAt()
        );
    }
}
