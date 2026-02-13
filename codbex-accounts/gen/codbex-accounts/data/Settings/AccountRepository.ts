import { Repository, EntityEvent, EntityConstructor } from '@aerokit/sdk/db'
import { Component } from '@aerokit/sdk/component'
import { Producer } from '@aerokit/sdk/messaging'
import { Extensions } from '@aerokit/sdk/extensions'
import { AccountEntity } from './AccountEntity'

@Component('AccountRepository')
export class AccountRepository extends Repository<AccountEntity> {

    constructor() {
        super((AccountEntity as EntityConstructor));
    }

    protected override async triggerEvent(data: EntityEvent<AccountEntity>): Promise<void> {
        const triggerExtensions = await Extensions.loadExtensionModules('codbex-accounts-Settings-Account', ['trigger']);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }
        });
        Producer.topic('codbex-accounts-Settings-Account').send(JSON.stringify(data));
    }
}
