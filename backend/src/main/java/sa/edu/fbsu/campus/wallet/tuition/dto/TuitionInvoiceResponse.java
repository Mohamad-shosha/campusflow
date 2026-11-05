package sa.edu.fbsu.campus.wallet.tuition.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import sa.edu.fbsu.campus.wallet.tuition.domain.InvoiceStatus;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionInvoice;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Schema(description = "Academic Term Tuition Invoice Summary")
public record TuitionInvoiceResponse(
        @Schema(description = "Invoice unique identifier", example = "550e8400-e29b-41d4-a716-446655440000")
        UUID id,

        @Schema(description = "Official institutional invoice number", example = "INV-2026-FALL-10101")
        String invoiceNumber,

        @Schema(description = "Academic term name in Arabic", example = "الفصل الدراسي الأول 2026/2027")
        String termNameAr,

        @Schema(description = "Academic term name in English", example = "Fall Semester 2026/2027")
        String termNameEn,

        @Schema(description = "Total term tuition assessed in SAR", example = "4500.00")
        BigDecimal totalAmount,

        @Schema(description = "Total settled payment amount in SAR", example = "720.00")
        BigDecimal paidAmount,

        @Schema(description = "Remaining unpaid balance in SAR", example = "3780.00")
        BigDecimal remainingAmount,

        @Schema(description = "Settlement status", example = "PARTIALLY_PAID")
        InvoiceStatus status,

        @Schema(description = "Invoice payment deadline", example = "2026-12-15")
        LocalDate dueDate
) {
    public static TuitionInvoiceResponse fromEntity(TuitionInvoice invoice) {
        return new TuitionInvoiceResponse(
                invoice.getId(),
                invoice.getInvoiceNumber(),
                invoice.getTerm().getNameAr(),
                invoice.getTerm().getNameEn(),
                invoice.getTotalAmount(),
                invoice.getPaidAmount(),
                invoice.getRemainingAmount(),
                invoice.getStatus(),
                invoice.getDueDate()
        );
    }
}

