package gen.codbex_accounts.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class JournalEntryDirectionRepository extends JavaRepository<JournalEntryDirectionEntity> {

    public JournalEntryDirectionRepository() {
        super(JournalEntryDirectionEntity.class);
    }

    @Override
    public JournalEntryDirectionEntity save(JournalEntryDirectionEntity entity) {
        JournalEntryDirectionEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-accounts-Settings-JournalEntryDirection", Json.stringify(saved));
        return saved;
    }

    @Override
    public JournalEntryDirectionEntity update(JournalEntryDirectionEntity entity) {
        JournalEntryDirectionEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-accounts-Settings-JournalEntryDirection-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "JournalEntryDirection-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public JournalEntryDirectionEntity updateWithoutEvent(JournalEntryDirectionEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(JournalEntryDirectionEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-accounts-Settings-JournalEntryDirection-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        JournalEntryDirectionEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-accounts-Settings-JournalEntryDirection-deleted", Json.stringify(entity));
        }
    }
}
