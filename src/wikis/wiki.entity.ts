import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Tiddler } from 'src/tiddlers/tiddler.entity';

@Entity()
export class Wiki {
  @PrimaryGeneratedColumn()
  uid: number;

  @Column({ length: 500, unique: true })
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({ length: 500 })
  subtitle: string;

  @Column('text')
  description: string;

  @OneToMany(() => Tiddler, (tiddler) => tiddler.wiki)
  tiddlers: Tiddler[];
}
