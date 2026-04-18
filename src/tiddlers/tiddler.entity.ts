import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import { Wiki } from 'src/wikis/wiki.entity';

@Entity()
export class Tiddler {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 500, unique: true })
  title: string;

  @Column({ length: 500, nullable: true })
  type?: string;

  @Column('text')
  text: string;

  @Column('text', { array: true })
  tags: string[];

  @Column('jsonb')
  meta: Record<string, any>;

  @ManyToOne(() => Wiki, (wiki) => wiki.tiddlers)
  wiki: Wiki;
}
