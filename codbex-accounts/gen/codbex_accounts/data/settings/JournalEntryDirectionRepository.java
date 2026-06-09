package gen.codbex_accounts.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class JournalEntryDirectionRepository extends JavaRepository<JournalEntryDirectionEntity> {

    public JournalEntryDirectionRepository() {
        super(JournalEntryDirectionEntity.class);
    }
}
