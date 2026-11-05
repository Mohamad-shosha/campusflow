package sa.edu.fbsu.campus.wallet.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import sa.edu.fbsu.campus.wallet.domain.Wallet;
import sa.edu.fbsu.campus.wallet.domain.WalletStatus;

import java.math.BigDecimal;
import java.util.UUID;

@Schema(description = "Institutional Member Digital Wallet Summary")
public record WalletResponse(
        @Schema(description = "Wallet unique identifier", example = "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d")
        UUID id,

        @Schema(description = "Current available balance", example = "720.00")
        BigDecimal balance,

        @Schema(description = "ISO Currency code", example = "SAR")
        String currency,

        @Schema(description = "Wallet account status", example = "ACTIVE")
        WalletStatus status,

        @Schema(description = "Owner user unique identifier", example = "7a4bc786-ff23-4bff-a282-6e9f88b4d43d")
        UUID userId,

        @Schema(description = "Owner university identification number", example = "STD-202410101")
        String universityNumber,

        @Schema(description = "Owner member English name", example = "Ahmed M. Al-Atwi")
        String ownerNameEn
) {
    public static WalletResponse fromEntity(Wallet wallet) {
        return new WalletResponse(
                wallet.getId(),
                wallet.getBalance(),
                wallet.getCurrency(),
                wallet.getStatus(),
                wallet.getUser().getId(),
                wallet.getUser().getUniversityNumber(),
                wallet.getUser().getFullNameEn()
        );
    }
}
