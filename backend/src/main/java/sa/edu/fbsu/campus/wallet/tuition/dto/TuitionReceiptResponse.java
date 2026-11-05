package sa.edu.fbsu.campus.wallet.tuition.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionReceipt;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Schema(description = "Official Institutional Tuition Payment Receipt")
public record TuitionReceiptResponse(
        @Schema(description = "Receipt unique identifier", example = "6ba7b810-9dad-11d1-80b4-00c04fd430c8")
        UUID id,

        @Schema(description = "Unique official receipt number", example = "FBSU-RCT-2026-981245")
        String receiptNumber,

        @Schema(description = "Associated tuition invoice number", example = "INV-2026-FALL-10101")
        String invoiceNumber,

        @Schema(description = "Academic term name in English", example = "Fall Semester 2026/2027")
        String termNameEn,

        @Schema(description = "Paid amount in SAR", example = "720.00")
        BigDecimal amountPaid,

        @Schema(description = "Settlement payment channel", example = "DIGITAL_WALLET")
        String paymentMethod,

        @Schema(description = "Cryptographic authenticity verification code", example = "FBSU-VERIFY-2026-A1B2C3D4")
        String verificationCode,

        @Schema(description = "Payload content for digital pass QR barcode rendering", example = "FBSU-TUITION-RECEIPT-981245-720.00-SAR")
        String qrContent,

        @Schema(description = "Student full name in English", example = "Ahmed M. Al-Atwi")
        String studentNameEn,

        @Schema(description = "Student institutional identification number", example = "STD-202410101")
        String studentUniversityNumber,

        @Schema(description = "Timestamp of transaction finalization", example = "2026-11-05T15:50:00Z")
        Instant createdAt
) {
    public static TuitionReceiptResponse fromEntity(TuitionReceipt receipt) {
        String qr = String.format("FBSU-RCT|%s|%s|%s|SAR|%s",
                receipt.getReceiptNumber(),
                receipt.getInvoice().getInvoiceNumber(),
                receipt.getAmountPaid(),
                receipt.getVerificationCode()
        );

        return new TuitionReceiptResponse(
                receipt.getId(),
                receipt.getReceiptNumber(),
                receipt.getInvoice().getInvoiceNumber(),
                receipt.getInvoice().getTerm().getNameEn(),
                receipt.getAmountPaid(),
                receipt.getPaymentMethod(),
                receipt.getVerificationCode(),
                qr,
                receipt.getPayer().getFullNameEn(),
                receipt.getPayer().getUniversityNumber(),
                receipt.getCreatedAt()
        );
    }
}

