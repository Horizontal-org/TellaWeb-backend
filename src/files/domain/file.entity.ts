import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  fileName: string;

  @Column()
  bucket: string;
}
