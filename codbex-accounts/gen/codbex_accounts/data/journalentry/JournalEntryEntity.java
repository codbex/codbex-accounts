package gen.codbex_accounts.data.journalentry;

import org.eclipse.dirigible.engine.java.annotations.Column;
import org.eclipse.dirigible.engine.java.annotations.CreatedAt;
import org.eclipse.dirigible.engine.java.annotations.CreatedBy;
import org.eclipse.dirigible.engine.java.annotations.Documentation;
import org.eclipse.dirigible.engine.java.annotations.Entity;
import org.eclipse.dirigible.engine.java.annotations.GeneratedValue;
import org.eclipse.dirigible.engine.java.annotations.GenerationType;
import org.eclipse.dirigible.engine.java.annotations.Id;
import org.eclipse.dirigible.engine.java.annotations.Table;
import org.eclipse.dirigible.engine.java.annotations.UpdatedAt;
import org.eclipse.dirigible.engine.java.annotations.UpdatedBy;

@Entity
@Table(name = "CODBEX_JOURNALENTRY")
@Documentation("JournalEntry entity mapping")
public class JournalEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JOURNALENTRY_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "JOURNALENTRY_DATE", nullable = true)
    @Documentation("Date")
    public java.time.LocalDate Date;

    @Column(name = "JOURNALENTRY_ACCOUNT", nullable = false)
    @Documentation("Account")
    public Integer Account;

    @Column(name = "JOURNALENTRY_DIRECTION", nullable = true)
    @Documentation("Direction")
    public Integer Direction;

    @CreatedAt
    @Column(name = "JOURNALENTRY_CREATEDAT", nullable = true)
    @Documentation("CreatedAt")
    public java.time.Instant CreatedAt;

    @CreatedBy
    @Column(name = "JOURNALENTRY_CREATEDBY", length = 20, nullable = true)
    @Documentation("CreatedBy")
    public String CreatedBy;

    @UpdatedAt
    @Column(name = "JOURNALENTRY_UPDATEDAT", nullable = true)
    @Documentation("UpdatedAt")
    public java.time.Instant UpdatedAt;

    @UpdatedBy
    @Column(name = "JOURNALENTRY_UPDATEDBY", length = 20, nullable = true)
    @Documentation("UpdatedBy")
    public String UpdatedBy;

}
