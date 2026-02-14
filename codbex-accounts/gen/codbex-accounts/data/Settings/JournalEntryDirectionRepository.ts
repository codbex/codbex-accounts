import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { JournalEntryDirectionEntity } from './JournalEntryDirectionEntity'

@Component('JournalEntryDirectionRepository')
export class JournalEntryDirectionRepository extends Repository<JournalEntryDirectionEntity> {

    constructor() {
        super((JournalEntryDirectionEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<JournalEntryDirectionEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-accounts-Settings-JournalEntryDirection', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-accounts-Settings-JournalEntryDirection').send(JSON.stringify(data));
    }
}
