package sa.edu.fbsu.campus.parking.dto;

import sa.edu.fbsu.campus.parking.domain.FlexOffer;
import sa.edu.fbsu.campus.parking.domain.FlexOfferStatus;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public record FlexOfferResponse(
        UUID id,
        UUID spotId,
        int bayNumber,
        String bayCode,
        String zoneCode,
        String zoneNameAr,
        String zoneNameEn,
        String offererNameAr,
        String offererNameEn,
        String claimerNameAr,
        String claimerNameEn,
        Instant startTime,
        Instant endTime,
        BigDecimal rewardAmount,
        String currency,
        FlexOfferStatus status,
        boolean rewardPaid
) {
    public static FlexOfferResponse fromEntity(FlexOffer offer) {
        String claimerAr = offer.getClaimer() != null ? offer.getClaimer().getFullNameAr() : null;
        String claimerEn = offer.getClaimer() != null ? offer.getClaimer().getFullNameEn() : null;

        return new FlexOfferResponse(
                offer.getId(),
                offer.getSpot().getId(),
                offer.getSpot().getBayNumber(),
                offer.getSpot().getBayCode(),
                offer.getSpot().getZone().getCode(),
                offer.getSpot().getZone().getNameAr(),
                offer.getSpot().getZone().getNameEn(),
                offer.getOfferer().getFullNameAr(),
                offer.getOfferer().getFullNameEn(),
                claimerAr,
                claimerEn,
                offer.getStartTime(),
                offer.getEndTime(),
                offer.getRewardAmount(),
                offer.getCurrency(),
                offer.getStatus(),
                offer.isRewardPaid()
        );
    }
}

