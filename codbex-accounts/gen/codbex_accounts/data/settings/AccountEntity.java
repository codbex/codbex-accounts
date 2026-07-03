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
