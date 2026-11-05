package sa.edu.fbsu.campus.wallet.tuition.infra;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.wallet.tuition.domain.TuitionReceipt;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface TuitionReceiptRepository extends JpaRepository<TuitionReceipt, UUID> {

    List<TuitionReceipt> findByPayerIdOrderByCreatedAtDesc(UUID payerId);

    List<TuitionReceipt> findByInvoiceIdOrderByCreatedAtDesc(UUID invoiceId);

    Optional<TuitionReceipt> findByReceiptNumber(String receiptNumber);

    Optional<TuitionReceipt> findByVerificationCode(String verificationCode);
}

