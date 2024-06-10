import { Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class ArticleListReqDto {
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0) //максисум нема ,бо через це буде реалізована пагінація
  @IsOptional()
  offset?: number = 0;

  @IsString()
  @IsOptional()
  tag?: string;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  @IsOptional()
  search?: string;
}
