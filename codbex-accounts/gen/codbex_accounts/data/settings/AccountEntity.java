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
@Table(name = "CODBEX_ACCOUNT")
@Documentation("Account entity mapping")
public class AccountEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ACCOUNT_ID")
    @Documentation("Id")
    public Integer Id;

    @Column(name = "ACCOUNT_NAME", length = 200, nullable = false, unique = true)
    @Documentation("Name")
    public String Name;

    @Column(name = "ACCOUNT_CODE", nullable = false, unique = true)
    @Documentation("Code")
    public Integer Code;

    @Column(name = "ACCOUNT_ACTIVE", nullable = true)
    @Documentation("Active")
    public Boolean Active;

}
