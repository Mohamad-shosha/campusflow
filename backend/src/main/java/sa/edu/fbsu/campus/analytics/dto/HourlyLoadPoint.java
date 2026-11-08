package sa.edu.fbsu.campus.analytics.dto;

public record HourlyLoadPoint(
        String time,
        int load,
        String color,
        String labelAr,
        String labelEn
) {}
