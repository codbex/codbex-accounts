import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

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

    @Documentation('Directions')
    @Column({
        name: 'JOURNALENTRY_DIRECTIONS',
        type: 'integer',
    })
    public Directions!: number;

}

(new JournalEntryEntity());
