import { ApiProperty } from '@nestjs/swagger';

export class BaseUserResDto {
  @ApiProperty({
    example: '121243234234',
    description: 'The id of user',
  })
  id: string;

  @ApiProperty({
    example: 'Azaza',
    description: 'The name of user',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'test@gmail.com',
    description: 'The email of user',
  })
  public readonly email: string;

  @ApiProperty({
    example: 'http://example.com/image.jpeg',
    description: 'The avatar of user',
  })
  public readonly avatar?: string;

  @ApiProperty({
    example: 20,
    description: 'The age of user',
  })
  public readonly age?: number;
}
