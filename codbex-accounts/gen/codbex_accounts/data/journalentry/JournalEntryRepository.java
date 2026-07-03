package gen.codbex_accounts.data.journalentry;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class JournalEntryRepository extends JavaRepository<JournalEntryEntity> {

    public JournalEntryRepository() {
        super(JournalEntryEntity.class);
    }

    @Override
    public JournalEntryEntity save(JournalEntryEntity entity) {
        JournalEntryEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-accounts-JournalEntry-JournalEntry", Json.stringify(saved));
        return saved;
    }

    @Override
    public JournalEntryEntity update(JournalEntryEntity entity) {
        JournalEntryEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-accounts-JournalEntry-JournalEntry-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "JournalEntry-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public JournalEntryEntity updateWithoutEvent(JournalEntryEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(JournalEntryEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-accounts-JournalEntry-JournalEntry-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        JournalEntryEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-accounts-JournalEntry-JournalEntry-deleted", Json.stringify(entity));
        }
    }
}
