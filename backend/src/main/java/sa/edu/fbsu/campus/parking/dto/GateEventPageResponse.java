package sa.edu.fbsu.campus.parking.dto;

import java.util.List;

/** Stable page envelope for gate history (avoids serializing Spring's PageImpl directly). */
public record GateEventPageResponse(
        List<GateEventResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {
}
