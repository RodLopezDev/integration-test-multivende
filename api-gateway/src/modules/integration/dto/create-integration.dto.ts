import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateIntegrationDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @ApiProperty()
  name: string;

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  @ApiProperty()
  clientId: string;

  @IsString()
  @MinLength(4)
  @MaxLength(200)
  @ApiProperty()
  clientSecret: string;
}
