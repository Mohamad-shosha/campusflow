package sa.edu.fbsu.campus.identity.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import sa.edu.fbsu.campus.identity.domain.UserType;

public record RegisterRequest(
        String universityCode,

        @NotBlank(message = "الرقم الجامعي مطلوب")
        @Size(min = 3, max = 50, message = "الرقم الجامعي يجب أن يكون بين 3 و 50 حرفاً")
        String universityNumber,

        @NotBlank(message = "البريد الإلكتروني مطلوب")
        @Email(message = "صيغة البريد الإلكتروني غير صحيحة")
        String email,

        @NotBlank(message = "كلمة المرور مطلوبة")
        @Size(min = 8, message = "كلمة المرور يجب ألا تقل عن 8 خانات")
        String password,

        @NotBlank(message = "الاسم الكامل باللغة العربية مطلوب")
        String fullNameAr,

        @NotBlank(message = "الاسم الكامل باللغة الإنجليزية مطلوب")
        String fullNameEn,

        @NotNull(message = "نوع المستخدم مطلوب")
        UserType userType,

        String phone,

        // Optional vehicle info
        String plateLettersAr,
        String plateDigits,
        String makeModel,
        String color
) {
}
