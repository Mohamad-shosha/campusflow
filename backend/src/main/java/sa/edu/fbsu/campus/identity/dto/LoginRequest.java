package sa.edu.fbsu.campus.identity.dto;

import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        String universityCode,

        @NotBlank(message = "الرقم الجامعي أو البريد الإلكتروني مطلوب")
        String identifier,

        @NotBlank(message = "كلمة المرور مطلوبة")
        String password
) {
}
