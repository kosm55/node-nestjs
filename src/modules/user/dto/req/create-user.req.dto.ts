import { Transform, Type } from 'class-transformer';
import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

class CarReqDto {
  @IsString()
  @MaxLength(255)
  producer: string;

  @IsString()
  model: string;
}

export class CreateUserReqDto {
  @IsString()
  @Length(3, 30)
  @Transform(TransformHelper.trim)
  public readonly name: string;

  @Matches(/^(?=.*[a-z])(?=.*\d)(?=.*[a-z0-9]).{8,}$/, {
    message: 'invalid email',
  })
  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @IsString()
  public readonly email: string;

  @IsString()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, {
    message: 'invalid email',
  })
  @Transform(TransformHelper.trim)
  public readonly password: string;

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

  @IsOptional()
  @ValidateNested({ each: true }) //це означає що це обєкт і ми будемо валідувати його
  @IsObject()
  @Type(() => CarReqDto)
  car: CarReqDto;
}
