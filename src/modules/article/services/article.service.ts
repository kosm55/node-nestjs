import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { In } from 'typeorm';

import { ArticleEntity } from '../../../database/entities/article.entity';
import { TagEntity } from '../../../database/entities/tag.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { LoggerService } from '../../logger/logger.service';
import { ArticleRepository } from '../../repository/services/article.repository';
import { TagRepository } from '../../repository/services/tag.repository';
import { UserRepository } from '../../repository/services/user.repository';
import { CreateArticleReqDto } from '../dto/req/create-article.req.dto';
import { UpdateArticleReqDto } from '../dto/req/update-article.req.dto';
import { ArticleResDto } from '../dto/res/article.res.dto';
import { ArticleMapper } from './article.mapper';

@Injectable()
export class ArticleService {
  constructor(
    private readonly logger: LoggerService,
    private readonly userRepository: UserRepository,
    private readonly articleRepository: ArticleRepository,
    private readonly tagRepository: TagRepository,
  ) {}

  public async getList(userData: IUserData, query: any): Promise<any> {
    const [entities, total] = await this.articleRepository.getList(
      userData,
      query,
    );
    return { entities, total };
  }

  public async create(
    userData: IUserData,
    dto: CreateArticleReqDto,
  ): Promise<ArticleResDto> {
    const tags = await this.createTags(dto.tags);
    const article = await this.articleRepository.save(
      this.articleRepository.create({
        ...dto,
        user_id: userData.userId,
        tags,
      }),
    );
    return ArticleMapper.toResponseDTO(article);
  }

  private async createTags(tags: string[]): Promise<TagEntity[]> {
    if (!tags || tags.length === 0) return []; //якщо масив тегів пустий або їх нема , то поверне пустий масив

    const entities = await this.tagRepository.findBy({ name: In(tags) });
    //шукаємо всі теги з бази , імена яких є в переданому масиві

    const existingTags = new Set(entities.map((tag) => tag.name));
    //які теги існують - знаходимо усі існуючі теги в базі та створюємо новий сет з цими унікальними іменами

    const newTags = tags.filter((tag) => !existingTags.has(tag));
    //знаходимо нові теги яких нема в базі(в наборі  existingTags)

    const newEntities = await this.tagRepository.save(
      newTags.map((name) => this.tagRepository.create({ name })),
    );
    // створюємо нові і зберігаємо їх
    return [...entities, ...newEntities]; // поєднали  існуючі і нові
  }

  public async getById(
    userData: IUserData,
    articleId: string,
  ): Promise<ArticleResDto> {
    const article = await this.articleRepository.findArticleById(
      userData,
      articleId,
    );
    if (!article) {
      throw new NotFoundException('article not found');
    }
    return ArticleMapper.toResponseDTO(article);
  }

  public async updateById(
    userData: IUserData,
    articleId: string,
    dto: UpdateArticleReqDto,
  ): Promise<ArticleResDto> {
    const article = await this.findMyArticleByIdOrThrow(
      userData.userId,
      articleId,
    );
    await this.articleRepository.save({ ...article, ...dto });
    const updateArticle = await this.articleRepository.findArticleById(
      userData,
      articleId,
    );
    return ArticleMapper.toResponseDTO(updateArticle);
  }

  public async deleteById(
    userData: IUserData,
    articleId: string,
  ): Promise<void> {
    const article = await this.findMyArticleByIdOrThrow(
      userData.userId,
      articleId,
    );
    //await this.articleRepository.save({ ...article, deleted : new Date() }); //softDelete
    await this.articleRepository.remove(article);
  }

  public async findMyArticleByIdOrThrow(
    userId: string,
    articleId: string,
  ): Promise<ArticleEntity> {
    const article = await this.articleRepository.findOneBy({
      id: articleId,
    });
    if (!article) {
      throw new NotFoundException('article not found');
    }
    if (article.user_id !== userId) {
      throw new ForbiddenException();
    }
    return article;
  }
}
