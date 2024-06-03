import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

import { BaseUserReqDto } from '../../../user/dto/req/base-user.req.dto';

export class BaseAuthReqDto extends PickType(BaseUserReqDto, [
  'email',
  'password',
  'bio',
  'name',
  'image',
]) {
  @IsNotEmpty()
  @IsString()
  readonly deviceId: string;
}
