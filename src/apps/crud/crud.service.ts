import { Injectable } from '@nestjs/common';
import { Model, Document } from 'mongoose';

@Injectable()
export class CrudService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async create(data: Partial<T>): Promise<T> {
    const createdDocument = new this.model(data);
    return createdDocument.save();
  }

  async findAll(): Promise<T[]> {
    return this.model.find().exec();
  }

  async findOne(id: string): Promise<T> {
    return this.model.findById(id).exec();
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id).exec();
  }
}
