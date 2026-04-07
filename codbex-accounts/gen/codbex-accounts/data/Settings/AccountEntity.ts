import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('AccountEntity')
@Table('CODBEX_ACCOUNT')
@Documentation('Account entity mapping')
export class AccountEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'ACCOUNT_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'ACCOUNT_NAME',
        type: 'string',
        length: 200,
    })
    public Name!: string;

    @Documentation('Code')
    @Column({
        name: 'ACCOUNT_CODE',
        type: 'integer',
    })
    public Code!: number;

    @Documentation('Active')
    @Column({
        name: 'ACCOUNT_ACTIVE',
        type: 'boolean',
        nullable: true,
    })
    public Active?: boolean;

    @Documentation('CreatedAt')
    @Column({
        name: 'ACCOUNT_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'ACCOUNT_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'ACCOUNT_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'ACCOUNT_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new AccountEntity());
