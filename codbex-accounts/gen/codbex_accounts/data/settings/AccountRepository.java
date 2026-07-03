package gen.codbex_accounts.data.settings;

import org.eclipse.dirigible.components.data.store.java.repository.JavaRepository;
import org.eclipse.dirigible.sdk.component.Repository;
import org.eclipse.dirigible.sdk.messaging.Producer;
import org.eclipse.dirigible.sdk.utils.Json;

@Repository
public class AccountRepository extends JavaRepository<AccountEntity> {

    public AccountRepository() {
        super(AccountEntity.class);
    }

    @Override
    public AccountEntity save(AccountEntity entity) {
        AccountEntity saved = super.save(entity);
        // Publish the create event so listeners (e.g. intent process triggers / reactions under gen/events) can react.
        Producer.sendToTopic("codbex-accounts-Settings-Account", Json.stringify(saved));
        return saved;
    }

    @Override
    public AccountEntity update(AccountEntity entity) {
        AccountEntity updated = super.update(entity);
        // Publish the update event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-accounts-Settings-Account-updated", Json.stringify(updated));
        return updated;
    }

    /**
     * Persists changes WITHOUT publishing the "-updated" event. Intended for system-managed
     * back-references — e.g. an intent process trigger writing ProcessId back onto the entity that
     * started it. Going through {@link #update} would re-publish "Account-updated" and spuriously
     * re-fire onUpdate reactions (notifications, roll-ups, integrations) for a change the user never made.
     */
    public AccountEntity updateWithoutEvent(AccountEntity entity) {
        return super.update(entity);
    }

    @Override
    public void delete(AccountEntity entity) {
        super.delete(entity);
        // Publish the delete event (suffixed topic) so intent reactions under gen/events can react.
        Producer.sendToTopic("codbex-accounts-Settings-Account-deleted", Json.stringify(entity));
    }

    @Override
    public void deleteById(Object id) {
        AccountEntity entity = findById(id);
        super.deleteById(id);
        if (entity != null) {
            Producer.sendToTopic("codbex-accounts-Settings-Account-deleted", Json.stringify(entity));
        }
    }
}
