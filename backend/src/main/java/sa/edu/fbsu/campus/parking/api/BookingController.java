package sa.edu.fbsu.campus.parking.api;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import sa.edu.fbsu.campus.common.security.UserPrincipal;
import sa.edu.fbsu.campus.parking.application.BookingService;
import sa.edu.fbsu.campus.parking.dto.BookingResponse;
import sa.edu.fbsu.campus.parking.dto.CreateBookingRequest;
import sa.edu.fbsu.campus.parking.dto.DigitalPassResponse;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/parking/bookings")
@Tag(name = "Parking Booking & Passes", description = "Endpoints for reserving bays, generating digital passes, and wallet deduction")
@PreAuthorize("isAuthenticated()")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @Operation(summary = "Reserve a parking bay with automatic institutional tariff calculation and wallet deduction")
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateBookingRequest request) {
        BookingResponse response = bookingService.createBooking(principal.getUserId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    @Operation(summary = "Get list of all parking bookings for current authenticated student/faculty")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getMyBookings(principal.getUserId()));
    }

    @GetMapping("/{bookingId}/pass")
    @Operation(summary = "Get digital parking pass and verifiable QR payload for active booking")
    public ResponseEntity<DigitalPassResponse> getDigitalPass(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID bookingId) {
        return ResponseEntity.ok(bookingService.getDigitalPass(principal.getUserId(), bookingId));
    }

    @PostMapping("/{bookingId}/cancel")
    @Operation(summary = "Cancel a confirmed booking and automatically refund payment to digital wallet")
    public ResponseEntity<BookingResponse> cancelBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable UUID bookingId,
            @RequestBody(required = false) Map<String, String> body) {
        String reason = (body != null && body.containsKey("reason")) ? body.get("reason") : "User requested cancellation";
        return ResponseEntity.ok(bookingService.cancelBooking(principal.getUserId(), bookingId, reason));
    }
}

