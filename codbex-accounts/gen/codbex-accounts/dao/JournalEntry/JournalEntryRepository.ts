import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface JournalEntryEntity {
    readonly Id: number;
    Date?: Date;
    Account: number;
    Directions: number;
}

export interface JournalEntryCreateEntity {
    readonly Date?: Date;
    readonly Account: number;
    readonly Directions: number;
}

export interface JournalEntryUpdateEntity extends JournalEntryCreateEntity {
    readonly Id: number;
}

export interface JournalEntryEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Account?: number | number[];
            Directions?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Date?: Date | Date[];
            Account?: number | number[];
            Directions?: number | number[];
        };
        contains?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            Directions?: number;
        };
        greaterThan?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            Directions?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            Directions?: number;
        };
        lessThan?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            Directions?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Date?: Date;
            Account?: number;
            Directions?: number;
        };
    },
    $select?: (keyof JournalEntryEntity)[],
    $sort?: string | (keyof JournalEntryEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface JournalEntryEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<JournalEntryEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface JournalEntryUpdateEntityEvent extends JournalEntryEntityEvent {
    readonly previousEntity: JournalEntryEntity;
}

export class JournalEntryRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_JOURNALENTRY",
        properties: [
            {
                name: "Id",
                column: "JOURNALENTRY_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Date",
                column: "JOURNALENTRY_DATE",
                type: "DATE",
            },
            {
                name: "Account",
                column: "JOURNALENTRY_ACCOUNT",
                type: "INTEGER",
                required: true
            },
            {
                name: "Directions",
                column: "JOURNALENTRY_DIRECTIONS",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(JournalEntryRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options?: JournalEntryEntityOptions): JournalEntryEntity[] {
        return this.dao.list(options).map((e: JournalEntryEntity) => {
            EntityUtils.setDate(e, "Date");
            return e;
        });
    }

    public findById(id: number): JournalEntryEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setDate(entity, "Date");
        return entity ?? undefined;
    }

    public create(entity: JournalEntryCreateEntity): number {
        EntityUtils.setLocalDate(entity, "Date");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_JOURNALENTRY",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRY_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: JournalEntryUpdateEntity): void {
        // EntityUtils.setLocalDate(entity, "Date");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_JOURNALENTRY",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "JOURNALENTRY_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: JournalEntryCreateEntity | JournalEntryUpdateEntity): number {
        const id = (entity as JournalEntryUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as JournalEntryUpdateEntity);
            return id;
        } else {
            return this.create(entity);
        }
    }

    public deleteById(id: number): void {
        const entity = this.dao.find(id);
        this.dao.remove(id);
        this.triggerEvent({
            operation: "delete",
            table: "CODBEX_JOURNALENTRY",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRY_ID",
                value: id
            }
        });
    }

    public count(options?: JournalEntryEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_JOURNALENTRY"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: JournalEntryEntityEvent | JournalEntryUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-accounts-JournalEntry-JournalEntry", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-accounts-JournalEntry-JournalEntry").send(JSON.stringify(data));
    }
}
