import { PartialType } from '@nestjs/swagger';
import { CreateMultivendeDto } from './create-multivende.dto';

export class UpdateMultivendeDto extends PartialType(CreateMultivendeDto) {}
