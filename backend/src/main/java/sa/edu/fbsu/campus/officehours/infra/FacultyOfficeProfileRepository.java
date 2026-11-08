package sa.edu.fbsu.campus.officehours.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.officehours.domain.FacultyOfficeProfile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FacultyOfficeProfileRepository extends JpaRepository<FacultyOfficeProfile, UUID> {

    @Query("SELECT p FROM FacultyOfficeProfile p JOIN FETCH p.faculty WHERE p.universityId = :universityId ORDER BY p.displayOrder ASC")
    List<FacultyOfficeProfile> findAllByUniversityIdWithFaculty(@Param("universityId") UUID universityId);

    @Query("SELECT p FROM FacultyOfficeProfile p JOIN FETCH p.faculty WHERE p.id = :id")
    Optional<FacultyOfficeProfile> findDetailedById(@Param("id") UUID id);

    @Query("SELECT p FROM FacultyOfficeProfile p JOIN FETCH p.faculty WHERE p.profileCode = :profileCode")
    Optional<FacultyOfficeProfile> findDetailedByProfileCode(@Param("profileCode") String profileCode);

    @Query("SELECT p FROM FacultyOfficeProfile p JOIN FETCH p.faculty WHERE p.faculty.id = :facultyUserId")
    Optional<FacultyOfficeProfile> findByFacultyUserId(@Param("facultyUserId") UUID facultyUserId);

    boolean existsByProfileCode(String profileCode);
}
