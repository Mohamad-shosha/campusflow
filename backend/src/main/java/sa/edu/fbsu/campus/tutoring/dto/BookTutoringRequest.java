package sa.edu.fbsu.campus.tutoring.dto;

import jakarta.validation.constraints.Size;

public record BookTutoringRequest(
        @Size(max = 100, message = "Idempotency key must not exceed 100 characters")
        String idempotencyKey
) {
}

