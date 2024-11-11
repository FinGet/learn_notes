import { PartialType } from '@nestjs/mapped-types';
import { CreateGlobalADto } from './create-global-a.dto';

export class UpdateGlobalADto extends PartialType(CreateGlobalADto) {}
