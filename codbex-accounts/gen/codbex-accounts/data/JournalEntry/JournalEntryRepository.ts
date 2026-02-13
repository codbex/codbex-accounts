import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { JournalEntryEntity } from './JournalEntryEntity'

@Component('JournalEntryRepository')
export class JournalEntryRepository extends Repository<JournalEntryEntity> {

    constructor() {
        super((JournalEntryEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<JournalEntryEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-accounts-JournalEntry-JournalEntry', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-accounts-JournalEntry-JournalEntry').send(JSON.stringify(data));
    }
}
