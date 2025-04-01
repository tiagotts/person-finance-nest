import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Card } from '@src/card/entities/card.entity';

export enum ImportType {
  OFX = 'OFX',
  CSV = 'CSV'
}

@Entity('import_files')
export class ImportFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column({
    type: 'enum',
    enum: ImportType,
    default: ImportType.OFX
  })
  type: ImportType;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ type: 'boolean', default: false })
  processed: boolean;

  @ManyToOne(() => Card, card => card.imports)
  card: Card;

  @Column()
  cardId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}