import { Entity, Table, Id, Generated, Column, Documentation } from '@aerokit/sdk/db'

@Entity('JournalEntryDirectionEntity')
@Table('CODBEX_JOURNALENTRYDIRECTION')
@Documentation('JournalEntryDirection entity mapping')
export class JournalEntryDirectionEntity {

    @Id()
    @Documentation('Id')
    @Column({
        name: 'JOURNALENTRYDIRECTIONS_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'JOURNALENTRYDIRECTIONS_NAME',
        type: 'string',
        length: 200,
    })
    public Name!: string;

}

(new JournalEntryDirectionEntity());
