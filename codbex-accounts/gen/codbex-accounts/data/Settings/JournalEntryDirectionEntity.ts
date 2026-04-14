import { Entity, Table, Id, Generated, Column, Documentation, CreatedAt, CreatedBy, UpdatedAt, UpdatedBy} from '@aerokit/sdk/db'

@Entity('JournalEntryDirectionEntity')
@Table('CODBEX_JOURNALENTRYDIRECTION')
@Documentation('JournalEntryDirection entity mapping')
export class JournalEntryDirectionEntity {

    @Id()
    @Generated('sequence')
    @Documentation('Id')
    @Column({
        name: 'JOURNALENTRYDIRECTION_ID',
        type: 'integer',
    })
    public Id?: number;

    @Documentation('Name')
    @Column({
        name: 'JOURNALENTRYDIRECTION_NAME',
        type: 'string',
        length: 20,
    })
    public Name!: string;

    @Documentation('Direction')
    @Column({
        name: 'JOURNALENTRYDIRECTION_DIRECTION',
        type: 'integer',
        nullable: true,
    })
    public Direction?: number;

}

(new JournalEntryDirectionEntity());
