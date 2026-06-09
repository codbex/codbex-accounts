package gen.codbex_accounts.data.settings;

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
