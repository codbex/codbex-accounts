import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

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
    })
    public Active!: boolean;

}

(new AccountEntity());
