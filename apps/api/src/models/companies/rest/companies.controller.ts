import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CompaniesService } from '../graphql/companies.service';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateCompany } from './dtos/create.dto';
import { CompanyQueryDto } from './dtos/query.dto';
import { UpdateCompany } from './dtos/update.dto';
import { CompanyEntity } from './entity/company.entity';
import { AllowAuthenticated } from 'src/common/auth/auth.decorator';

@ApiTags('companies')
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CompanyEntity })
  @Post()
  create(@Body() createCompanyDto: CreateCompany) {
    return this.companiesService.createFromRest(createCompanyDto);
  }

  @ApiOkResponse({ type: [CompanyEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: CompanyQueryDto) {
    return this.companiesService.findAll({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    } as any);
  }

  @ApiOkResponse({ type: CompanyEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.companiesService.findOne({ where: { id } });
  }

  @ApiOkResponse({ type: CompanyEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompany) {
    return this.companiesService.update({ id, ...updateCompanyDto });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.companiesService.remove({ where: { id } });
  }
}
