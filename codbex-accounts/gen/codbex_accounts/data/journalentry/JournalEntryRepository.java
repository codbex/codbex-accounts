package gen.codbex_accounts.data.journalentry;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.engine.java.annotations.Repository;

@Repository
public class JournalEntryRepository extends JavaRepository<JournalEntryEntity> {

    public JournalEntryRepository() {
        super(JournalEntryEntity.class);
    }
}
