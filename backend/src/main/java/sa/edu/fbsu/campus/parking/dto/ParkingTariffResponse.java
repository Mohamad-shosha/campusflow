package sa.edu.fbsu.campus.parking.dto;

import sa.edu.fbsu.campus.identity.domain.UserType;

import java.math.BigDecimal;
import java.util.UUID;

public record ParkingTariffResponse(
        UUID id,
        UserType userType,
        BigDecimal hourlyRate,
        BigDecimal dailyCap,
        BigDecimal flexCashbackRate
) {}

