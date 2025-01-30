import { Controller, Get, Post, Put, Delete, Param, Body , BadRequestException} from '@nestjs/common';
import { CrudService } from './crud.service';
import { Document } from 'mongoose';
import * as Joi from 'joi';

@Controller()
export class CrudController<T extends Document> {
  constructor(
    private readonly service: CrudService<T>,
    private readonly validationSchemas: Record<string, Joi.ObjectSchema>
  
  ) {}

  @Post()
  async create(@Body() data: Partial<T>): Promise<T> {
    // Validate the data dynamically
    const { error } = this.validationSchemas['create'].validate(data);
    if (error) {
      throw new BadRequestException(`Validation failed: ${error.message}`);
    }

    return this.service.create(data);
  }

  @Get()
  async findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
    return this.service.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<T>): Promise<T> {
    return this.service.update(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.service.delete(id);
  }

}
