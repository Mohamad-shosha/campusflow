package sa.edu.fbsu.campus.parking.application;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import sa.edu.fbsu.campus.parking.domain.GateEventLog;
import sa.edu.fbsu.campus.parking.dto.GateEventPageResponse;
import sa.edu.fbsu.campus.parking.dto.GateEventResponse;
import sa.edu.fbsu.campus.parking.infra.GateEventLogRepository;

import java.util.Locale;
import java.util.Set;
import java.util.UUID;

/** Read-only access to recorded gate scan decisions, newest first. */
@Service
@Transactional(readOnly = true)
public class GateHistoryService {

    static final int MAX_PAGE_SIZE = 100;
    static final Set<String> DECISIONS = Set.of("GRANTED", "DENIED");

    private final GateEventLogRepository gateEventLogRepository;

    public GateHistoryService(GateEventLogRepository gateEventLogRepository) {
        this.gateEventLogRepository = gateEventLogRepository;
    }

    public GateEventPageResponse getEvents(UUID universityId, int page, int size, String decision) {
        if (page < 0) {
            throw new IllegalArgumentException("page must be >= 0");
        }
        if (size < 1 || size > MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("size must be between 1 and " + MAX_PAGE_SIZE);
        }
        PageRequest pageable = PageRequest.of(page, size);

        Page<GateEventLog> result;
        if (decision == null || decision.isBlank()) {
            result = gateEventLogRepository.findByUniversityIdOrderByCreatedAtDesc(universityId, pageable);
        } else {
            String normalized = decision.trim().toUpperCase(Locale.ROOT);
            if (!DECISIONS.contains(normalized)) {
                throw new IllegalArgumentException("decision must be one of " + DECISIONS);
            }
            result = gateEventLogRepository.findByUniversityIdAndDecisionOrderByCreatedAtDesc(
                    universityId, normalized, pageable);
        }

        return new GateEventPageResponse(
                result.getContent().stream().map(GateEventResponse::fromEntity).toList(),
                result.getNumber(),
                result.getSize(),
                result.getTotalElements(),
                result.getTotalPages());
    }
}
