import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { TagEntity } from '../../../database/entities/tag.entity';

@Injectable()
export class TagRepository extends Repository<TagEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(TagEntity, dataSource.manager);
  }

  public async getList(): Promise<TagEntity[]> {
    const qb = this.createQueryBuilder('tag');
    qb.leftJoin('tag.articles', 'article');

    qb.addSelect('COUNT(article.id)', 'tag_articlesCount');
    //рахує скільки стовпців з ід артіклів у таблиці по кожному тегу і кладе це число у tag_articlesCount
    //tag_articlesCount- це поле вкладене у наш тег, а articlesCount- це віртуальне поле у нашій ентіті яке ми додали
    //тобто ми усе порахували і поклали у певне поле
    //далі це поле можна використати об робити сортування
    qb.groupBy('tag.id');
    qb.orderBy('"tag_articlesCount"', 'DESC');

    qb.limit(10);

    return await qb.getMany();
  }
}
