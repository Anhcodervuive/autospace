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
import { PrismaService } from 'src/common/prisma/prisma.service';
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
  constructor(private readonly prisma: PrismaService) {}

  @AllowAuthenticated()
  @ApiBearerAuth()
  @ApiCreatedResponse({ type: CompanyEntity })
  @Post()
  create(@Body() createCompanyDto: CreateCompany) {
    return this.prisma.company.create({ data: createCompanyDto });
  }

  @ApiOkResponse({ type: [CompanyEntity] })
  @Get()
  findAll(@Query() { skip, take, order, sortBy }: CompanyQueryDto) {
    return this.prisma.company.findMany({
      ...(skip !== undefined ? { skip: +skip } : {}),
      ...(take !== undefined ? { take: +take } : {}),
      ...(sortBy ? { orderBy: { [sortBy]: order ?? 'asc' } } : {}),
    });
  }

  @ApiOkResponse({ type: CompanyEntity })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.prisma.company.findUnique({ where: { id } });
  }

  @ApiOkResponse({ type: CompanyEntity })
  @ApiBearerAuth()
  @AllowAuthenticated()
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateCompanyDto: UpdateCompany) {
    return this.prisma.company.update({
      where: { id },
      data: updateCompanyDto,
    });
  }

  @ApiBearerAuth()
  @AllowAuthenticated()
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.prisma.company.delete({ where: { id } });
  }
}
