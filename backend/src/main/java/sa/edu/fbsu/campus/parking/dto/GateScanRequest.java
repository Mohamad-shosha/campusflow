package sa.edu.fbsu.campus.parking.dto;

import jakarta.validation.constraints.NotBlank;

public record GateScanRequest(
        @NotBlank(message = "Arabic plate letters are required (e.g. أ ب ح)")
        String plateLettersAr,

        @NotBlank(message = "Plate numeric digits are required (e.g. 1234)")
        String plateDigits,

        String gateId
) {
    public GateScanRequest {
        if (gateId == null || gateId.isBlank()) {
            gateId = "MAIN_GATE_IN";
        }
    }
}

