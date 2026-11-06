package sa.edu.fbsu.campus.parking.dto;

public record GateDecisionResponse(
        String decision,
        String gateAction,
        String reasonCode,
        String displayMessageAr,
        String displayMessageEn,
        Integer bayNumber,
        String bayCode,
        String zoneCode,
        String zoneNameAr,
        String zoneNameEn,
        String driverNameAr,
        String driverNameEn,
        String userType,
        String scannedPlate
) {
    public static GateDecisionResponse granted(
            String reasonCode,
            String messageAr,
            String messageEn,
            Integer bayNumber,
            String bayCode,
            String zoneCode,
            String zoneNameAr,
            String zoneNameEn,
            String driverNameAr,
            String driverNameEn,
            String userType,
            String scannedPlate
    ) {
        return new GateDecisionResponse(
                "GRANTED",
                "OPEN_BARRIER",
                reasonCode,
                messageAr,
                messageEn,
                bayNumber,
                bayCode,
                zoneCode,
                zoneNameAr,
                zoneNameEn,
                driverNameAr,
                driverNameEn,
                userType,
                scannedPlate
        );
    }

    public static GateDecisionResponse denied(
            String reasonCode,
            String messageAr,
            String messageEn,
            String scannedPlate
    ) {
        return new GateDecisionResponse(
                "DENIED",
                "KEEP_CLOSED",
                reasonCode,
                messageAr,
                messageEn,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                scannedPlate
        );
    }
}

