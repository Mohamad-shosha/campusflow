package sa.edu.fbsu.campus.officehours.dto;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import sa.edu.fbsu.campus.officehours.domain.OfficeHourSlot;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DisplayName("Office hours: next-available text and slot availability are derived from real times")
class FacultyOfficeResponseTest {

    private static OfficeHourSlot slot(Instant start, boolean available, String ar, String en) {
        return new OfficeHourSlot(UUID.randomUUID(), null, start, start.plus(15, ChronoUnit.MINUTES), ar, en, 15, available, null);
    }

    @Test
    void nextAvailableUsesEarliestUpcomingFreeSlot() {
        Instant now = Instant.now();
        List<OfficeHourSlot> slots = List.of(
                slot(now.minus(2, ChronoUnit.DAYS), true, "قديم", "OLD"),
                slot(now.plus(3, ChronoUnit.DAYS), true, "11:00 ص", "LATER"),
                slot(now.plus(1, ChronoUnit.DAYS), false, "10:00 ص", "BOOKED"),
                slot(now.plus(2, ChronoUnit.DAYS), true, "09:00 ص", "NEXT"));

        assertThat(FacultyOfficeResponse.nextAvailable(slots, false)).endsWith(" - NEXT");
        assertThat(FacultyOfficeResponse.nextAvailable(slots, true)).endsWith(" - 09:00 ص");
    }

    @Test
    void noUpcomingSlotsSaysSo() {
        List<OfficeHourSlot> slots = List.of(slot(Instant.now().minus(1, ChronoUnit.HOURS), true, "x", "x"));
        assertThat(FacultyOfficeResponse.nextAvailable(slots, false)).isEqualTo("No upcoming slots");
    }

    @Test
    void pastSlotIsNeverAvailable() {
        assertThat(OfficeHourSlotDto.fromEntity(slot(Instant.now().minus(1, ChronoUnit.HOURS), true, "x", "x")).available()).isFalse();
        assertThat(OfficeHourSlotDto.fromEntity(slot(Instant.now().plus(1, ChronoUnit.HOURS), true, "x", "x")).available()).isTrue();
    }
}
