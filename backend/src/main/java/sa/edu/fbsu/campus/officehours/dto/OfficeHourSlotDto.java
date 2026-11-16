package sa.edu.fbsu.campus.officehours.dto;

import sa.edu.fbsu.campus.officehours.domain.OfficeHourSlot;

import java.time.Instant;
import java.util.UUID;

public record OfficeHourSlotDto(
        UUID id,
        Instant startTime,
        Instant endTime,
        String timeLabelAr,
        String timeLabelEn,
        int durationMinutes,
        boolean available,
        String bookedNote
) {
    public static OfficeHourSlotDto fromEntity(OfficeHourSlot s) {
        return new OfficeHourSlotDto(
                s.getId(),
                s.getStartTime(),
                s.getEndTime(),
                s.getTimeLabelAr(),
                s.getTimeLabelEn(),
                s.getDurationMinutes(),
                s.isAvailable() && s.getStartTime() != null && s.getStartTime().isAfter(java.time.Instant.now()),
                // Slots are listed publicly: never expose which student booked (older rows stored the name).
                s.getBookedNote() != null ? "محجوز" : null
        );
    }
}
