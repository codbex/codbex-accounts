import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";

export interface JournalEntryDirectionEntity {
    readonly Id: number;
    Name: string;
}

export interface JournalEntryDirectionCreateEntity {
    readonly Name: string;
}

export interface JournalEntryDirectionUpdateEntity extends JournalEntryDirectionCreateEntity {
    readonly Id: number;
}

export interface JournalEntryDirectionEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
        };
        contains?: {
            Id?: number;
            Name?: string;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
        };
    },
    $select?: (keyof JournalEntryDirectionEntity)[],
    $sort?: string | (keyof JournalEntryDirectionEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
}

interface JournalEntryDirectionEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<JournalEntryDirectionEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

interface JournalEntryDirectionUpdateEntityEvent extends JournalEntryDirectionEntityEvent {
    readonly previousEntity: JournalEntryDirectionEntity;
}

export class JournalEntryDirectionRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_JOURNALENTRYDIRECTION",
        properties: [
            {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: false,
            },
            {
                name: "Name",
                column: "JOURNALENTRYDIRECTIONS_NAME",
                type: "VARCHAR",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(JournalEntryDirectionRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options?: JournalEntryDirectionEntityOptions): JournalEntryDirectionEntity[] {
        return this.dao.list(options);
    }

    public findById(id: number): JournalEntryDirectionEntity | undefined {
        const entity = this.dao.find(id);
        return entity ?? undefined;
    }

    public create(entity: JournalEntryDirectionCreateEntity): number {
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_JOURNALENTRYDIRECTION",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: JournalEntryDirectionUpdateEntity): void {
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_JOURNALENTRYDIRECTION",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: JournalEntryDirectionCreateEntity | JournalEntryDirectionUpdateEntity): number {
        const id = (entity as JournalEntryDirectionUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as JournalEntryDirectionUpdateEntity);
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
            table: "CODBEX_JOURNALENTRYDIRECTION",
            entity: entity,
            key: {
                name: "Id",
                column: "JOURNALENTRYDIRECTIONS_ID",
                value: id
            }
        });
    }

    public count(options?: JournalEntryDirectionEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_JOURNALENTRYDIRECTION"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: JournalEntryDirectionEntityEvent | JournalEntryDirectionUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-accounts-Settings-JournalEntryDirection", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-accounts-Settings-JournalEntryDirection").send(JSON.stringify(data));
    }
}
