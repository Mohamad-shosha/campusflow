package sa.edu.fbsu.campus.parking.dto;

import sa.edu.fbsu.campus.parking.domain.BookingStatus;
import sa.edu.fbsu.campus.parking.domain.ParkingBooking;

import java.time.Instant;
import java.util.UUID;

public record DigitalPassResponse(
        UUID bookingId,
        String passCode,
        String qrPayload,
        String studentNameAr,
        String studentNameEn,
        String universityNumber,
        int bayNumber,
        String bayCode,
        String zoneCode,
        String zoneNameAr,
        String vehiclePlate,
        Instant validFrom,
        Instant validUntil,
        BookingStatus status
) {
    public static DigitalPassResponse fromEntity(ParkingBooking booking) {
        String plate = null;
        if (booking.getVehicle() != null && booking.getVehicle().getPlate() != null) {
            plate = booking.getVehicle().getPlate().getLettersAr() + " " + booking.getVehicle().getPlate().getDigits();
        }
        return new DigitalPassResponse(
                booking.getId(),
                booking.getDigitalPassCode(),
                booking.getQrToken(),
                booking.getUser().getFullNameAr(),
                booking.getUser().getFullNameEn(),
                booking.getUser().getUniversityNumber(),
                booking.getSpot().getBayNumber(),
                booking.getSpot().getBayCode(),
                booking.getSpot().getZone().getCode(),
                booking.getSpot().getZone().getNameAr(),
                plate,
                booking.getStartTime(),
                booking.getEndTime(),
                booking.getStatus()
        );
    }
}
