package sa.edu.fbsu.campus.wallet.tuition.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionInvoice;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TuitionInvoiceRepository extends JpaRepository<TuitionInvoice, UUID> {

    List<TuitionInvoice> findByStudentIdOrderByDueDateAsc(UUID studentId);

    Optional<TuitionInvoice> findByInvoiceNumber(String invoiceNumber);

    boolean existsByStudentIdAndTermId(UUID studentId, UUID termId);
}

