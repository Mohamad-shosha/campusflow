package sa.edu.fbsu.campus.wallet.infra;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import sa.edu.fbsu.campus.wallet.domain.LedgerEntry;
import sa.edu.fbsu.campus.wallet.domain.TransactionDirection;
import sa.edu.fbsu.campus.wallet.domain.TransactionType;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LedgerEntryRepository extends JpaRepository<LedgerEntry, UUID> {

    boolean existsByIdempotencyKey(String idempotencyKey);

    Optional<LedgerEntry> findByIdempotencyKey(String idempotencyKey);

    Page<LedgerEntry> findByWalletIdOrderByCreatedAtDesc(UUID walletId, Pageable pageable);

    List<LedgerEntry> findTop50ByWalletIdOrderByCreatedAtDesc(UUID walletId);

    /**
     * Sum of ledger amounts for a university, filtered by transaction type, direction and
     * idempotency-key prefix (use "" for no prefix filter). Returns 0 when there are no rows.
     */
    @Query("""
            SELECT COALESCE(SUM(e.amount), 0) FROM LedgerEntry e
            WHERE e.wallet.universityId = :universityId
              AND e.transactionType = :type
              AND e.direction = :direction
              AND e.idempotencyKey LIKE CONCAT(:keyPrefix, '%')
            """)
    BigDecimal sumAmount(
            @Param("universityId") UUID universityId,
            @Param("type") TransactionType type,
            @Param("direction") TransactionDirection direction,
            @Param("keyPrefix") String keyPrefix);
}
