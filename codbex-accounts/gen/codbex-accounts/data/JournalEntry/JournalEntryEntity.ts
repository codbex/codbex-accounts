import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('JournalEntryEntity')
@Table('CODBEX_JOURNALENTRY')
@Documentation('JournalEntry entity mapping')
export class JournalEntryEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'JOURNALENTRY_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Date')
    @Column({
        name: 'JOURNALENTRY_DATE',
        type: 'date',
        nullable: true,
    })
    public Date?: Date;

    @Documentation('Account')
    @Column({
        name: 'JOURNALENTRY_ACCOUNT',
        type: 'integer',
    })
    public Account!: number;

    @Documentation('Direction')
    @Column({
        name: 'JOURNALENTRY_DIRECTION',
        type: 'integer',
        nullable: true,
    })
    public Direction?: number;

    @Documentation('CreatedAt')
    @Column({
        name: 'JOURNALENTRY_CREATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @CreatedAt()
    public CreatedAt?: Date;

    @Documentation('CreatedBy')
    @Column({
        name: 'JOURNALENTRY_CREATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @CreatedBy()
    public CreatedBy?: string;

    @Documentation('UpdatedAt')
    @Column({
        name: 'JOURNALENTRY_UPDATEDAT',
        type: 'timestamp',
        nullable: true,
    })
    @UpdatedAt()
    public UpdatedAt?: Date;

    @Documentation('UpdatedBy')
    @Column({
        name: 'JOURNALENTRY_UPDATEDBY',
        type: 'string',
        length: 20,
        nullable: true,
    })
    @UpdatedBy()
    public UpdatedBy?: string;

}

(new JournalEntryEntity());
