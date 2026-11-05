package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Profile Update Request")
public record UpdateProfileRequest(
        @Size(max = 255, message = "الاسم الكامل بالعربية يجب ألا يتجاوز 255 حرفاً")
        @Schema(description = "Full Name in Arabic", example = "أحمد محمد العطوي")
        String fullNameAr,

        @Size(max = 255, message = "الاسم الكامل بالإنجليزية يجب ألا يتجاوز 255 حرفاً")
        @Schema(description = "Full Name in English", example = "Ahmed Mohammed Al-Atwi")
        String fullNameEn,

        @Size(max = 50, message = "رقم الجوال يجب ألا يتجاوز 50 حرفاً")
        @Schema(description = "Phone Number", example = "0512345678")
        String phone,

        @Size(max = 150, message = "التخصص يجب ألا يتجاوز 150 حرفاً")
        @Schema(description = "Academic Specialty", example = "هندسة البرمجيات")
        String specialty,

        @Size(max = 10, message = "اللغة يجب ألا تتجاوز 10 أحرف")
        @Schema(description = "Interface Language (ar or en)", example = "ar")
        String locale,

        @Size(max = 10, message = "الثيم يجب ألا يتجاوز 10 أحرف")
        @Schema(description = "Interface Theme (dark or light)", example = "dark")
        String theme
) {
}

