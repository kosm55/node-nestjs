import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { ArticleEntity } from '../../../database/entities/article.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';

@Injectable()
export class ArticleRepository extends Repository<ArticleEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(ArticleEntity, dataSource.manager);
  }
  public async getList(
    userData: IUserData,
    query: any,
  ): Promise<[ArticleEntity[], number]> {
    const qb = this.createQueryBuilder('article');

    qb.leftJoinAndSelect('article.tags', 'tag');
    qb.leftJoinAndSelect('article.user', 'user');
    // qb.leftJoinAndSelect(
    //   'user.followings',
    //   'follow',
    //   'follow.follower_id= :myId',
    // );

    qb.orderBy('article.created', 'DESC');
    qb.take(query.limit || 5);
    qb.skip(query.offset || 0);

    // qb.andWhere() додати умову статус делете-null, це коли софт деліт,  коли видалені пости не треба показувати
    return await qb.getManyAndCount();
  }
  public async findArticleById(
    userData: IUserData,
    articleId: string,
  ): Promise<ArticleEntity> {
    const qb = this.createQueryBuilder('article');

    qb.leftJoinAndSelect('article.tags', 'tag');
    qb.leftJoinAndSelect('article.user', 'user');
    qb.leftJoinAndSelect(
      'user.followings',
      'follow',
      'follow.follower_id= :myId',
    );
    qb.where('article.id=:articleId ');
    qb.setParameter('articleId', articleId);
    qb.setParameter('myId', userData.userId);
    return await qb.getOne();
  }
}

// //Створюмо QueryBuilder для запиту до таблиці статей,
// //приєднуємо таблиці tags і user до article з використанням псевдонімів tag і user
// //шукаємо статтю за заданим ідентифікатором articleId
// //повертає одну знайдену статтю, включаючи її теги та користувача
// public async findArticleById(articleId: string): Promise<ArticleEntity> {
//   const qb = this.createQueryBuilder('article');
//   //createQueryBuilder - створює новий екземпляр QueryBuilder,
//   // який дозволяє створювати SQL-запити за допомогою методів TypeORM
//   //article-псевдонім, який використовується для таблиці статей у запиті, це наша articles з бд
//
//   qb.leftJoinAndSelect('article.tags', 'tag');
//   //до результату запиту будуть додані всі теги, пов'язані зі статтею
//   //article.tags-вказує на те, що ми приєднуємо до статті колекцію тегів
//   //tag- це псевдонім для приєднаної таблиці tags, який буде використовуватись у запиті.
//
//   qb.leftJoinAndSelect('article.user', 'user');
//   //до результату запиту буде додано інформацію про користувача, який створив статтю
//   //article.user- вказує на те, що ми приєднуємо до статті користувача, який створив цю статтю
//   //user- це псевдонім для приєднаної таблиці user, який буде використовуватись у запиті.
//
//   qb.leftJoinAndSelect(
//     'user.followings',
//     'follow',
//     'follow.follower_id= :userId',
//   );
//
//   //qb.where('article.id=:articleId ', { articleId });
//   qb.where('article.id=:articleId ');
//   //перевіряє чи ідентифікатор статті (article.id) відповідає значенню параметра :articleId.
//
//   qb.setParameter('articleId', articleId);
//   //встановлює значення параметра articleId, яке передається у метод
//   return await qb.getOne();
//   // поверне один об'єкт типу ArticleEntity
// }
