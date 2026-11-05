package sa.edu.fbsu.campus.identity.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import sa.edu.fbsu.campus.identity.domain.UserType;

@Schema(description = "Institutional User Registration Payload")
public record RegisterRequest(
        @Schema(description = "Institutional university code", example = "FBSU")
        String universityCode,

        @NotBlank(message = "الرقم الجامعي مطلوب")
        @Size(min = 3, max = 50, message = "الرقم الجامعي يجب أن يكون بين 3 و 50 حرفاً")
        @Schema(description = "University identification number (e.g. 202410123)", example = "202410123")
        String universityNumber,

        @NotBlank(message = "البريد الإلكتروني مطلوب")
        @Email(message = "صيغة البريد الإلكتروني غير صحيحة")
        @Schema(description = "Institutional email address", example = "student@fbsu.edu.sa")
        String email,

        @NotBlank(message = "كلمة المرور مطلوبة")
        @Size(min = 8, message = "كلمة المرور يجب ألا تقل عن 8 خانات")
        @Schema(description = "Strong password (minimum 8 characters)", example = "SecretPass123!")
        String password,

        @NotBlank(message = "الاسم الكامل باللغة العربية مطلوب")
        @Schema(description = "Full name in Arabic", example = "أحمد محمد العطوي")
        String fullNameAr,

        @NotBlank(message = "الاسم الكامل باللغة الإنجليزية مطلوب")
        @Schema(description = "Full name in English", example = "Ahmed Mohammed Al-Atwi")
        String fullNameEn,

        @NotNull(message = "نوع المستخدم مطلوب")
        @Schema(description = "Institutional user affiliation type", example = "STUDENT")
        UserType userType,

        @Schema(description = "Saudi mobile phone number", example = "+966501234567")
        String phone,

        // Optional vehicle info
        @Schema(description = "Arabic license plate letters (e.g. أ ب ح)", example = "أ ب ح")
        String plateLettersAr,

        @Schema(description = "License plate digits (e.g. 1234)", example = "1234")
        String plateDigits,

        @Schema(description = "Vehicle make and model", example = "Toyota Camry 2024")
        String makeModel,

        @Schema(description = "Vehicle color", example = "White")
        String color
) {
}
