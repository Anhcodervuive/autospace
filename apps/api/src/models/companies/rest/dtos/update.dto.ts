import { PartialType } from '@nestjs/swagger';
import { CreateCompany } from './create.dto';

export class UpdateCompany extends PartialType(CreateCompany) {}
