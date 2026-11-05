package sa.edu.fbsu.campus.wallet.tuition.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.wallet.tuition.application.TuitionService;
import sa.edu.fbsu.campus.wallet.tuition.dto.PayTuitionRequest;
import sa.edu.fbsu.campus.wallet.tuition.dto.TuitionInvoiceResponse;
import sa.edu.fbsu.campus.wallet.tuition.dto.TuitionReceiptResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tuition")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Tuition & Academic Invoicing", description = "Tuition invoices, wallet payments, installment settlements, and verified digital receipts")
public class TuitionController {

    private final TuitionService tuitionService;

    public TuitionController(TuitionService tuitionService) {
        this.tuitionService = tuitionService;
    }

    @GetMapping("/invoices")
    @Operation(summary = "Get Student Invoices", description = "Retrieve all academic tuition invoices and payment statuses for the authenticated student")
    public ResponseEntity<List<TuitionInvoiceResponse>> getStudentInvoices(@AuthenticationPrincipal UserPrincipal principal) {
        List<TuitionInvoiceResponse> invoices = tuitionService.getStudentInvoices(principal.getUserId());
        return ResponseEntity.ok(invoices);
    }

    @GetMapping("/invoices/{invoiceId}")
    @Operation(summary = "Get Invoice Details", description = "Retrieve specific tuition invoice line items, amounts, and remaining balance")
    public ResponseEntity<TuitionInvoiceResponse> getInvoiceDetails(
            @Parameter(description = "Invoice UUID identifier") @PathVariable UUID invoiceId) {
        TuitionInvoiceResponse invoice = tuitionService.getInvoiceDetails(invoiceId);
        return ResponseEntity.ok(invoice);
    }

    @PostMapping("/pay")
    @Operation(summary = "Pay Tuition Invoice", description = "Settle tuition fees using student digital wallet balance and generate official digital receipt")
    public ResponseEntity<TuitionReceiptResponse> payTuition(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody PayTuitionRequest request) {
        TuitionReceiptResponse receipt = tuitionService.payTuition(principal.getUserId(), request);
        return ResponseEntity.ok(receipt);
    }

    @GetMapping("/receipts")
    @Operation(summary = "Get Student Receipts", description = "Retrieve all verified academic tuition payment receipts for the authenticated student")
    public ResponseEntity<List<TuitionReceiptResponse>> getStudentReceipts(@AuthenticationPrincipal UserPrincipal principal) {
        List<TuitionReceiptResponse> receipts = tuitionService.getStudentReceipts(principal.getUserId());
        return ResponseEntity.ok(receipts);
    }

    @GetMapping("/receipts/{receiptId}")
    @Operation(summary = "Get Receipt Details", description = "Retrieve detailed receipt including verification code, ledger transaction reference, and paid breakdown")
    public ResponseEntity<TuitionReceiptResponse> getReceiptDetails(
            @Parameter(description = "Receipt UUID identifier") @PathVariable UUID receiptId) {
        TuitionReceiptResponse receipt = tuitionService.getReceiptDetails(receiptId);
        return ResponseEntity.ok(receipt);
    }
}

