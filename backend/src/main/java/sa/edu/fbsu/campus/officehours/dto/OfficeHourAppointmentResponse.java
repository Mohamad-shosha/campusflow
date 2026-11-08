package sa.edu.fbsu.campus.officehours.dto;

import sa.edu.fbsu.campus.officehours.domain.OfficeHourAppointment;

import java.time.Instant;
import java.util.UUID;

public record OfficeHourAppointmentResponse(
        UUID id,
        UUID slotId,
        String profileCode,
        String facultyNameAr,
        String facultyNameEn,
        String officeLocation,
        String studentUniversityNumber,
        String studentNameAr,
        String timeLabelAr,
        String timeLabelEn,
        Instant startTime,
        Instant endTime,
        String topic,
        String status,
        Instant createdAt,
        FacultyOfficeResponse updatedFaculty
) {
    public static OfficeHourAppointmentResponse fromEntity(
            OfficeHourAppointment appt,
            FacultyOfficeResponse updatedFaculty
    ) {
        return new OfficeHourAppointmentResponse(
                appt.getId(),
                appt.getSlot().getId(),
                appt.getProfile().getProfileCode(),
                appt.getProfile().getFaculty().getFullNameAr(),
                appt.getProfile().getFaculty().getFullNameEn(),
                appt.getProfile().getOfficeLocation(),
                appt.getStudent().getUniversityNumber(),
                appt.getStudent().getFullNameAr(),
                appt.getSlot().getTimeLabelAr(),
                appt.getSlot().getTimeLabelEn(),
                appt.getStartTime(),
                appt.getEndTime(),
                appt.getTopic(),
                appt.getStatus().name(),
                appt.getCreatedAt(),
                updatedFaculty
        );
    }
}
