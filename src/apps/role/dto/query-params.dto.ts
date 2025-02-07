import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class QueryParamsDTO {
  @ApiProperty({
    required: false,
    description: 'Search term for filtering users',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    description: 'Filters for dynamic filtering of users',
  })
  @IsOptional()
  @IsString()
  filters?: string;

  @ApiProperty({
    required: false,
    description: 'Page number for pagination',
  })
  @IsOptional()
  @IsNumberString()
  pageNumber?: number;

  @ApiProperty({
    required: false,
    description: 'Page size for pagination',
  })
  @IsOptional()
  @IsNumberString()
  pageSize?: number;

  @ApiProperty({
    required: false,
    description: 'Sort order for the results',
  })
  @IsOptional()
  @IsString()
  sort?: string;

  @ApiProperty({
    required: false,
    description: 'Page size for pagination',
  })
  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    required: false,
    description: 'Page size for pagination',
  })
  @IsOptional()
  @IsNumberString()
  filterValue?: number;

  @IsOptional()
  @IsNumberString()
  @ApiProperty({
    required: false,
    description: 'Page size for pagination',
  })
  @IsOptional()
  @IsNumberString()
  filterBy?: number;
}
