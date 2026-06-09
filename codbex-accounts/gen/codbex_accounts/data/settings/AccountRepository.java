package gen.codbex_accounts.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class AccountRepository extends JavaRepository<AccountEntity> {

    public AccountRepository() {
        super(AccountEntity.class);
    }
}
