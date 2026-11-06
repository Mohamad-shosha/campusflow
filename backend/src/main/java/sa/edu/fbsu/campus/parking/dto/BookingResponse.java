package sa.edu.fbsu.campus.parking.dto;

import sa.edu.fbsu.campus.parking.domain.BookingStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingBooking;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record BookingResponse(
        UUID id,
        UUID spotId,
        int bayNumber,
        String zoneCode,
        String zoneNameAr,
        String zoneNameEn,
        String vehiclePlate,
        Instant startTime,
        Instant endTime,
        BigDecimal durationHours,
        BigDecimal ratePerHour,
        BigDecimal totalAmount,
        String currency,
        BookingStatus status,
        String digitalPassCode,
        String qrToken,
        Instant createdAt
) {
    public static BookingResponse fromEntity(ParkingBooking booking) {
        String plate = null;
        if (booking.getVehicle() != null && booking.getVehicle().getPlate() != null) {
            plate = booking.getVehicle().getPlate().getLettersAr() + " " + booking.getVehicle().getPlate().getDigits();
        }
        return new BookingResponse(
                booking.getId(),
                booking.getSpot().getId(),
                booking.getSpot().getBayNumber(),
                booking.getSpot().getZone().getCode(),
                booking.getSpot().getZone().getNameAr(),
                booking.getSpot().getZone().getNameEn(),
                plate,
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getDurationHours(),
                booking.getRatePerHour(),
                booking.getTotalAmount(),
                booking.getCurrency(),
                booking.getStatus(),
                booking.getDigitalPassCode(),
                booking.getQrToken(),
                booking.getCreatedAt()
        );
    }
}
