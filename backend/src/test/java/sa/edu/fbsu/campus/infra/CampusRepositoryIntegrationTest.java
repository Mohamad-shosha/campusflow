package sa.edu.fbsu.campus.infra;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import sa.edu.fbsu.campus.common.AbstractPostgresIntegrationTest;
import sa.edu.fbsu.campus.domain.AcademicTerm;
import sa.edu.fbsu.campus.domain.Building;
import sa.edu.fbsu.campus.domain.College;
import sa.edu.fbsu.campus.domain.University;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class CampusRepositoryIntegrationTest extends AbstractPostgresIntegrationTest {

    @Autowired
    private UniversityRepository universityRepository;

    @Autowired
    private CollegeRepository collegeRepository;

    @Autowired
    private BuildingRepository buildingRepository;

    @Autowired
    private AcademicTermRepository academicTermRepository;

    @Test
    @DisplayName("Should persist and retrieve University tenant by code")
    void shouldPersistAndRetrieveUniversity() {
        University uni = new University("KSU", "جامعة الملك سعود", "King Saud University");
        uni.setDomain("ksu.edu.sa");
        University saved = universityRepository.save(uni);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getCreatedAt()).isNotNull();
        assertThat(saved.getVersion()).isEqualTo(0L);

        Optional<University> found = universityRepository.findByCode("KSU");
        assertThat(found).isPresent();
        assertThat(found.get().getNameAr()).isEqualTo("جامعة الملك سعود");
        assertThat(found.get().getTimezone()).isEqualTo("Asia/Riyadh");
    }

    @Test
    @DisplayName("Should enforce tenant isolation: two universities can share same college code")
    void shouldEnforceTenantIsolationOnCollegeCode() {
        // University A
        University uniA = universityRepository.save(
                new University("UNI-A-" + UUID.randomUUID().toString().substring(0, 6), "جامعة أ", "University A")
        );
        // University B
        University uniB = universityRepository.save(
                new University("UNI-B-" + UUID.randomUUID().toString().substring(0, 6), "جامعة ب", "University B")
        );

        // Both universities create a college with identical code 'ENG'
        College colA = collegeRepository.save(new College(uniA.getId(), "ENG", "كلية الهندسة أ", "College of Engineering A"));
        College colB = collegeRepository.save(new College(uniB.getId(), "ENG", "كلية الهندسة ب", "College of Engineering B"));

        assertThat(colA.getId()).isNotEqualTo(colB.getId());

        // Verify isolation by tenant university_id
        List<College> uniAColleges = collegeRepository.findByUniversityId(uniA.getId());
        assertThat(uniAColleges).hasSize(1);
        assertThat(uniAColleges.get(0).getNameEn()).isEqualTo("College of Engineering A");

        List<College> uniBColleges = collegeRepository.findByUniversityId(uniB.getId());
        assertThat(uniBColleges).hasSize(1);
        assertThat(uniBColleges.get(0).getNameEn()).isEqualTo("College of Engineering B");
    }

    @Test
    @DisplayName("Should reject duplicate college code within the SAME university tenant")
    void shouldRejectDuplicateCollegeCodeInSameTenant() {
        University uni = universityRepository.save(
                new University("UNI-DUP-" + UUID.randomUUID().toString().substring(0, 6), "جامعة فريدة", "Unique University")
        );

        collegeRepository.save(new College(uni.getId(), "SCI", "كلية العلوم 1", "College of Science 1"));

        // Attempt duplicate college code under the same university tenant
        College duplicate = new College(uni.getId(), "SCI", "كلية العلوم 2", "College of Science 2");

        assertThatThrownBy(() -> {
            collegeRepository.saveAndFlush(duplicate);
        }).isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    @DisplayName("Should persist building with floor count under university tenant")
    void shouldPersistBuilding() {
        University uni = universityRepository.save(
                new University("UNI-BLD-" + UUID.randomUUID().toString().substring(0, 6), "جامعة المباني", "Building University")
        );

        Building building = new Building(uni.getId(), "ENG-BLD-01", "مبنى الهندسة الشمالي", "North Engineering Hall", 4);
        Building saved = buildingRepository.save(building);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getFloors()).isEqualTo(4);

        Optional<Building> found = buildingRepository.findByUniversityIdAndCode(uni.getId(), "ENG-BLD-01");
        assertThat(found).isPresent();
        assertThat(found.get().getFloors()).isEqualTo(4);
    }

    @Test
    @DisplayName("Should retrieve active/current academic term for a university tenant")
    void shouldRetrieveCurrentAcademicTerm() {
        University uni = universityRepository.save(
                new University("UNI-TERM-" + UUID.randomUUID().toString().substring(0, 6), "جامعة الفصول", "Term University")
        );

        AcademicTerm term1 = new AcademicTerm(
                uni.getId(),
                "2026-FALL",
                "خريف 2026",
                "Fall 2026",
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2027, 1, 15),
                true
        );
        academicTermRepository.save(term1);

        Optional<AcademicTerm> currentTerm = academicTermRepository.findByUniversityIdAndCurrentTrue(uni.getId());
        assertThat(currentTerm).isPresent();
        assertThat(currentTerm.get().getCode()).isEqualTo("2026-FALL");
        assertThat(currentTerm.get().isCurrent()).isTrue();
    }
}

