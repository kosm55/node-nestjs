import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';

import { TransformHelper } from '../../../common/helpers/transform.helper';

export class UpdateUserReqDto {
  @IsString()
  @Length(3, 30)
  @Transform(TransformHelper.trim)
  public readonly name: string;

  @IsOptional() // не обов'язкове поле  @IsOptional() , якщо поля нема то помилки не буде
  @ValidateIf((object) => object.age > 25) //умова, якщо вік більше 25 то починаємо валідувати аватар ,
  // де object це весь наш об'єкт ваділації описаний,  в інших випадках не валідуємо
  @IsString()
  @MaxLength(255)
  @Transform(TransformHelper.trim)
  public readonly avatar?: string;

  @IsNumber()
  @IsOptional()
  @Min(18)
  @Max(150)
  @Type(() => Number) //буде намагатись привести в число , якщо не вийде то бед реквест
  public readonly age?: number;
}
