import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateVerification {
  @ApiProperty()
  @IsNumber()
  garageId: number;
  @ApiProperty()
  @IsBoolean()
  verified: boolean;
  @ApiProperty()
  @IsString()
  adminId: string;
}
