package sa.edu.fbsu.campus.tutoring.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateTutoringSessionRequest(
        @NotBlank(message = "Course code is required")
        @Size(max = 60, message = "Course code must not exceed 60 characters")
        String courseCode,

        @NotBlank(message = "Arabic course name is required")
        @Size(max = 220, message = "Course name must not exceed 220 characters")
        String courseNameAr,

        @Size(max = 220, message = "English course name must not exceed 220 characters")
        String courseNameEn,

        @NotBlank(message = "Covered lectures text is required")
        @Size(max = 255, message = "Covered lectures must not exceed 255 characters")
        String coveredLectures,

        @NotBlank(message = "Covered scope description is required")
        @Size(max = 1000, message = "Covered scope must not exceed 1000 characters")
        String coveredScope,

        @NotBlank(message = "Category is required")
        @Size(max = 40, message = "Category must not exceed 40 characters")
        String category,

        @DecimalMin(value = "0.50", message = "Duration must be at least 0.5 hours")
        @DecimalMax(value = "4.00", message = "Duration must not exceed 4.0 hours")
        BigDecimal durationHours,

        @NotBlank(message = "Schedule text is required")
        @Size(max = 160, message = "Schedule text must not exceed 160 characters")
        String scheduleText,

        @NotBlank(message = "Location is required")
        @Size(max = 220, message = "Location must not exceed 220 characters")
        String location,

        @Min(value = 1, message = "Max capacity must be at least 1")
        @Max(value = 50, message = "Max capacity must not exceed 50")
        Integer maxCapacity
) {
}

