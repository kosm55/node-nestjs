import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { CommentEntity } from './comment.entity';
import { TableNameEnum } from './enums/table-name.enum';
import { LikeEntity } from './like.entity';
import { BaseModel } from './models/base.model';
import { TagEntity } from './tag.entity';
import { UserEntity } from './user.entity';

@Entity({ name: TableNameEnum.ARTICLES })
export class ArticleEntity extends BaseModel {
  @Column('text')
  title: string;

  @Column('text')
  description: string;

  @Column('text')
  body: string;

  @Column()
  user_id: string;
  @ManyToOne(() => UserEntity, (entity) => entity.articles)
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;

  @OneToMany(() => LikeEntity, (entity) => entity.article)
  likes?: LikeEntity[];

  @ManyToMany(() => TagEntity, (entity) => entity.articles)
  tags?: TagEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.article)
  comments?: LikeEntity[];
}
