import { sql, query } from "@aerokit/sdk/db";
import { producer } from "@aerokit/sdk/messaging";
import { extensions } from "@aerokit/sdk/extensions";
import { dao as daoApi } from "@aerokit/sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface AccountEntity {
    readonly Id: number;
    Name: string;
    Code: number;
    Active: boolean;
}

export interface AccountCreateEntity {
    readonly Name: string;
    readonly Code: number;
    readonly Active: boolean;
}

export interface AccountUpdateEntity extends AccountCreateEntity {
    readonly Id: number;
}

export interface AccountEntityOptions {
    $filter?: {
        equals?: {
            Id?: number | number[];
            Name?: string | string[];
            Code?: number | number[];
            Active?: boolean | boolean[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Code?: number | number[];
            Active?: boolean | boolean[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
        };
    },
    $select?: (keyof AccountEntity)[],
    $sort?: string | (keyof AccountEntity)[],
    $order?: 'ASC' | 'DESC',
    $offset?: number,
    $limit?: number,
    $language?: string
}

export interface AccountEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<AccountEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export interface AccountUpdateEntityEvent extends AccountEntityEvent {
    readonly previousEntity: AccountEntity;
}

export class AccountRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ACCOUNT",
        properties: [
            {
                name: "Id",
                column: "ACCOUNT_ID",
                type: "INTEGER",
                id: true,
                autoIncrement: true,
            },
            {
                name: "Name",
                column: "ACCOUNT_NAME",
                type: "VARCHAR",
                required: true
            },
            {
                name: "Code",
                column: "ACCOUNT_CODE",
                type: "INTEGER",
                required: true
            },
            {
                name: "Active",
                column: "ACCOUNT_ACTIVE",
                type: "BOOLEAN",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(AccountRepository.DEFINITION, undefined, dataSource);
    }

    public findAll(options: AccountEntityOptions = {}): AccountEntity[] {
        let list = this.dao.list(options).map((e: AccountEntity) => {
            EntityUtils.setBoolean(e, "Active");
            return e;
        });
        return list;
    }

    public findById(id: number, options: AccountEntityOptions = {}): AccountEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setBoolean(entity, "Active");
        return entity ?? undefined;
    }

    public create(entity: AccountCreateEntity): number {
        EntityUtils.setBoolean(entity, "Active");
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ACCOUNT",
            entity: entity,
            key: {
                name: "Id",
                column: "ACCOUNT_ID",
                value: id
            }
        });
        return id;
    }

    public update(entity: AccountUpdateEntity): void {
        EntityUtils.setBoolean(entity, "Active");
        const previousEntity = this.findById(entity.Id);
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ACCOUNT",
            entity: entity,
            previousEntity: previousEntity,
            key: {
                name: "Id",
                column: "ACCOUNT_ID",
                value: entity.Id
            }
        });
    }

    public upsert(entity: AccountCreateEntity | AccountUpdateEntity): number {
        const id = (entity as AccountUpdateEntity).Id;
        if (!id) {
            return this.create(entity);
        }

        const existingEntity = this.findById(id);
        if (existingEntity) {
            this.update(entity as AccountUpdateEntity);
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
            table: "CODBEX_ACCOUNT",
            entity: entity,
            key: {
                name: "Id",
                column: "ACCOUNT_ID",
                value: id
            }
        });
    }

    public count(options?: AccountEntityOptions): number {
        return this.dao.count(options);
    }

    public customDataCount(): number {
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ACCOUNT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: AccountEntityEvent | AccountUpdateEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-accounts-Settings-Account", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-accounts-Settings-Account").send(JSON.stringify(data));
    }
}
