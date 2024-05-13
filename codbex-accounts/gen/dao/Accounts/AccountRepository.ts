import { query } from "sdk/db";
import { producer } from "sdk/messaging";
import { extensions } from "sdk/extensions";
import { dao as daoApi } from "sdk/db";
import { EntityUtils } from "../utils/EntityUtils";

export interface AccountEntity {
    readonly Id: number;
    Name: string;
    Code: number;
    Active: boolean;
    Normal: number;
}

export interface AccountCreateEntity {
    readonly Name: string;
    readonly Code: number;
    readonly Active: boolean;
    readonly Normal: number;
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
            Normal?: number | number[];
        };
        notEquals?: {
            Id?: number | number[];
            Name?: string | string[];
            Code?: number | number[];
            Active?: boolean | boolean[];
            Normal?: number | number[];
        };
        contains?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
            Normal?: number;
        };
        greaterThan?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
            Normal?: number;
        };
        greaterThanOrEqual?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
            Normal?: number;
        };
        lessThan?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
            Normal?: number;
        };
        lessThanOrEqual?: {
            Id?: number;
            Name?: string;
            Code?: number;
            Active?: boolean;
            Normal?: number;
        };
    },
    $select?: (keyof AccountEntity)[],
    $sort?: string | (keyof AccountEntity)[],
    $order?: 'asc' | 'desc',
    $offset?: number,
    $limit?: number,
}

interface AccountEntityEvent {
    readonly operation: 'create' | 'update' | 'delete';
    readonly table: string;
    readonly entity: Partial<AccountEntity>;
    readonly key: {
        name: string;
        column: string;
        value: number;
    }
}

export class AccountRepository {

    private static readonly DEFINITION = {
        table: "CODBEX_ACCOUNT_ACCOUNT",
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
            },
            {
                name: "Normal",
                column: "ACCOUNT_NORMAL",
                type: "INTEGER",
                required: true
            }
        ]
    };

    private readonly dao;

    constructor(dataSource = "DefaultDB") {
        this.dao = daoApi.create(AccountRepository.DEFINITION, null, dataSource);
    }

    public findAll(options?: AccountEntityOptions): AccountEntity[] {
        return this.dao.list(options).map((e: AccountEntity) => {
            EntityUtils.setBoolean(e, "Active");
            return e;
        });
    }

    public findById(id: number): AccountEntity | undefined {
        const entity = this.dao.find(id);
        EntityUtils.setBoolean(entity, "Active");
        return entity ?? undefined;
    }

    public create(entity: AccountCreateEntity): number {
        EntityUtils.setBoolean(entity, "Active");
        if (entity.Normal === undefined || entity.Normal === null) {
            (entity as AccountEntity).Normal = 1;
        }
        const id = this.dao.insert(entity);
        this.triggerEvent({
            operation: "create",
            table: "CODBEX_ACCOUNT_ACCOUNT",
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
        this.dao.update(entity);
        this.triggerEvent({
            operation: "update",
            table: "CODBEX_ACCOUNT_ACCOUNT",
            entity: entity,
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
            table: "CODBEX_ACCOUNT_ACCOUNT",
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
        const resultSet = query.execute('SELECT COUNT(*) AS COUNT FROM "CODBEX_ACCOUNT_ACCOUNT"');
        if (resultSet !== null && resultSet[0] !== null) {
            if (resultSet[0].COUNT !== undefined && resultSet[0].COUNT !== null) {
                return resultSet[0].COUNT;
            } else if (resultSet[0].count !== undefined && resultSet[0].count !== null) {
                return resultSet[0].count;
            }
        }
        return 0;
    }

    private async triggerEvent(data: AccountEntityEvent) {
        const triggerExtensions = await extensions.loadExtensionModules("codbex-account-Accounts-Account", ["trigger"]);
        triggerExtensions.forEach(triggerExtension => {
            try {
                triggerExtension.trigger(data);
            } catch (error) {
                console.error(error);
            }            
        });
        producer.topic("codbex-account-Accounts-Account").send(JSON.stringify(data));
    }
}
