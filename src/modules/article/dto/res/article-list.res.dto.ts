import { ArticleResDto } from './article.res.dto';

export class ArticleListResDto {
  data: ArticleResDto[];
  meta: {
    total: number; //скільки всього за конкретним запитом
    limit: number; // скльіки маю на сторінці
    offset: number; //скільки скіпнули , для того щоб фронт розумі на якій сторінці знаходимось
  };
}
