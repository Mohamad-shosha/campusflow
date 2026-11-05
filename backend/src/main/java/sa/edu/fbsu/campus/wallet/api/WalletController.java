package sa.edu.fbsu.campus.wallet.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.wallet.application.WalletService;
import sa.edu.fbsu.campus.wallet.dto.LedgerEntryResponse;
import sa.edu.fbsu.campus.wallet.dto.TopUpRequest;
import sa.edu.fbsu.campus.wallet.dto.TransferRequest;
import sa.edu.fbsu.campus.wallet.dto.WalletResponse;

@RestController
@RequestMapping("/api/v1/wallet")
@SecurityRequirement(name = "BearerAuth")
@Tag(name = "Digital Wallet & Financial Ledger", description = "Management of institutional balances, top-ups, peer transfers, and append-only ledger transaction history")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping
    @Operation(summary = "Get User Digital Wallet", description = "Retrieve current available balance, ISO currency, and status for the authenticated campus member")
    public ResponseEntity<WalletResponse> getWallet(@AuthenticationPrincipal UserPrincipal principal) {
        WalletResponse response = walletService.getWalletResponse(principal.getUserId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/ledger")
    @Operation(summary = "Get Wallet Transaction Ledger", description = "Retrieve paginated immutable transaction history for the authenticated member's digital wallet")
    public ResponseEntity<Page<LedgerEntryResponse>> getLedgerHistory(
            @AuthenticationPrincipal UserPrincipal principal,
            @Parameter(description = "Zero-based page index (0..N)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size (default 20)")
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, Math.min(size, 100), Sort.by("createdAt").descending());
        Page<LedgerEntryResponse> history = walletService.getLedgerHistory(principal.getUserId(), pageable);
        return ResponseEntity.ok(history);
    }

    @PostMapping("/top-up")
    @Operation(summary = "Top Up Wallet Balance", description = "Add funds to digital wallet via simulated institutional payment gateway with strict idempotency protection")
    public ResponseEntity<WalletResponse> topUp(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TopUpRequest request
    ) {
        WalletResponse response = walletService.topUp(principal.getUserId(), request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/transfer")
    @Operation(summary = "Peer-to-Peer Balance Transfer", description = "Atomically transfer funds between campus members with deadlock prevention and idempotency guarantee")
    public ResponseEntity<WalletResponse> transfer(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody TransferRequest request
    ) {
        WalletResponse response = walletService.transfer(principal.getUserId(), request);
        return ResponseEntity.ok(response);
    }
}
