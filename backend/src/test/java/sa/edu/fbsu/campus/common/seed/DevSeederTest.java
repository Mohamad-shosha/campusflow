package sa.edu.fbsu.campus.common.seed;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.University;
import sa.edu.fbsu.campus.identity.domain.Role;
import sa.edu.fbsu.campus.identity.domain.User;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@ActiveProfiles("dev")
class DevSeederTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private DevSeeder devSeeder;

    @Autowired
    private sa.edu.fbsu.campus.identity.infra.UserRepository userRepository;

    @Autowired
    private sa.edu.fbsu.campus.identity.infra.VehicleRepository vehicleRepository;

    @Autowired
    private sa.edu.fbsu.campus.infra.CollegeRepository collegeRepository;

    @Autowired
    private sa.edu.fbsu.campus.infra.BuildingRepository buildingRepository;

    @Autowired
    private sa.edu.fbsu.campus.infra.UniversityRepository universityRepository;

    @Autowired
    private sa.edu.fbsu.campus.parking.infra.ParkingZoneRepository parkingZoneRepository;

    @Autowired
    private sa.edu.fbsu.campus.parking.infra.ParkingSpotRepository parkingSpotRepository;

    @Test
    @DisplayName("DevSeeder should populate FBSU demo dataset and be idempotent")
    void shouldSeedFbsuDemoDataAndBeIdempotent() {
        // Run seeder once
        devSeeder.run();

        // 1. Verify University
        University fbsu = universityRepository.findByCode("FBSU").orElse(null);
        assertThat(fbsu).isNotNull();

        // 2. Verify seeded colleges & buildings
        assertThat(collegeRepository.findByUniversityId(fbsu.getId())).isNotEmpty();
        assertThat(buildingRepository.findByUniversityId(fbsu.getId())).isNotEmpty();

        // 3. Verify Admin, Security, Faculty, Students
        User admin = userRepository.findByEmail("admin@fbsu.edu.sa").orElse(null);
        assertThat(admin).isNotNull();
        assertThat(admin.getRoles()).contains(Role.CAMPUS_ADMIN);

        User security = userRepository.findByEmail("security@fbsu.edu.sa").orElse(null);
        assertThat(security).isNotNull();
        assertThat(security.getRoles()).contains(Role.SECURITY_OFFICER);

        User student = userRepository.findByEmail("ahmed.student@fbsu.edu.sa").orElse(null);
        assertThat(student).isNotNull();
        assertThat(student.getRoles()).contains(Role.STUDENT);

        // 4. Verify Student vehicle
        assertThat(vehicleRepository.findByUserId(student.getId())).isNotEmpty();

        // 5. Verify Parking Zones and 40 Spots
        assertThat(parkingZoneRepository.findAllByUniversityIdOrderByCodeAsc(fbsu.getId())).hasSize(5);
        assertThat(parkingSpotRepository.findAllByUniversityIdOrderByBayNumberAsc(fbsu.getId())).hasSize(40);

        var spot1 = parkingSpotRepository.findByUniversityIdAndBayNumber(fbsu.getId(), 1).orElse(null);
        assertThat(spot1).isNotNull();
        assertThat(spot1.isFlexEligible()).isTrue();

        var spot26 = parkingSpotRepository.findByUniversityIdAndBayNumber(fbsu.getId(), 26).orElse(null);
        assertThat(spot26).isNotNull();
        assertThat(spot26.getSpotType()).isEqualTo(sa.edu.fbsu.campus.parking.domain.SpotType.EV_CHARGING);

        // 6. Idempotency: running again must not throw, and must not put demo data back on a bay
        // whose state changed since (it used to reset occupants of booked/claimed/freed bays).
        spot1.setStatus(sa.edu.fbsu.campus.parking.domain.SpotStatus.AVAILABLE);
        spot1.setOccupantNameAr(null);
        spot1.setOccupantNameEn(null);
        spot1.setTimeLeft(null, null);
        parkingSpotRepository.save(spot1);
        assertDoesNotThrow(() -> devSeeder.run());
        var after = parkingSpotRepository.findByUniversityIdAndBayNumber(fbsu.getId(), 1).orElseThrow();
        assertThat(after.getStatus()).isEqualTo(sa.edu.fbsu.campus.parking.domain.SpotStatus.AVAILABLE);
        assertThat(after.getOccupantNameAr()).isNull();
        assertThat(after.getTimeLeftText()).isNull();
    }
}

