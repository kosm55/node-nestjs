import { ArticleEntity } from '../../../database/entities/article.entity';
import { ArticleResDto } from '../dto/res/article.res.dto';

export class ArticleMapper {
  public static toResponseDTO(entity: ArticleEntity): ArticleResDto {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      body: entity.body || null,
      created: entity.created,
      updated: entity.update,
      tags: entity.tags.map((tag) => tag.name),
    };
  }
}
