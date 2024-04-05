import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import {
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber({
    maxDecimalPlaces: 4,
  })
  @IsOptional()
  @Min(0)
  @Type(() => Number)
  price?: number;
}
