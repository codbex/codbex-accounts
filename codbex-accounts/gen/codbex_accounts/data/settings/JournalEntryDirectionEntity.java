package gen.codbex_accounts.data.settings;

import org.eclipse.dirigible.sdk.db.Column;
import org.eclipse.dirigible.sdk.db.CreatedAt;
import org.eclipse.dirigible.sdk.db.CreatedBy;
import org.eclipse.dirigible.sdk.platform.Documentation;
import org.eclipse.dirigible.sdk.db.Entity;
import org.eclipse.dirigible.sdk.db.GeneratedValue;
import org.eclipse.dirigible.sdk.db.GenerationType;
import org.eclipse.dirigible.sdk.db.Id;
import org.eclipse.dirigible.sdk.db.Table;
import org.eclipse.dirigible.sdk.db.UpdatedAt;
import org.eclipse.dirigible.sdk.db.UpdatedBy;

@Entity
@Table(name = "CODBEX_JOURNALENTRYDIRECTION")
@Documentation("JournalEntryDirection entity mapping")
public class JournalEntryDirectionEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "JOURNALENTRYDIRECTION_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "JOURNALENTRYDIRECTION_NAME", length = 20, nullable = false, unique = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "JOURNALENTRYDIRECTION_DIRECTION", nullable = true)
    @Documentation("Direction")
    public Integer Direction;

}
