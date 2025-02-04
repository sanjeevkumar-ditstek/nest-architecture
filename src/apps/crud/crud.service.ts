import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  Logger
} from '@nestjs/common';
import { Model, Document } from 'mongoose';

@Injectable()
export class CrudService<T extends Document> {
  private readonly logger = new Logger(CrudService.name);

  constructor(protected readonly model: Model<T>) {}

  // Create new document
  async create(data: Partial<T>): Promise<T> {
    try {
      const createdDocument = new this.model(data);
      return await createdDocument.save();
    } catch (error) {
      // Log the error (optional)
      console.error('Error creating document:', error);
      throw new InternalServerErrorException('Failed to create the document');
    }
  }

  // Find all documents
  async findAll(): Promise<T[]> {
    try {
      return await this.model.find().exec();
    } catch (error) {
      // Log the error (optional)
      console.error('Error fetching all documents:', error);
      throw new InternalServerErrorException('Failed to fetch documents');
    }
  }

  // Find one document by ID
  async findOne(id: string): Promise<T> {
    try {
      const document = await this.model.findById(id).exec();
      if (!document) {
        this.logger.error(`Document with ID ${id} not found`)
        throw new NotFoundException(`Document with ID ${id} not found`);
      }
      return document;
    } catch (error) {
      // Log the error (optional)
      console.error('Error fetching document by ID:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a NotFoundException
      }
      throw new InternalServerErrorException('Failed to fetch the document');
    }
  }

  // Update document by ID
  async update(id: string, data: Partial<T>): Promise<T> {
    try {
      const updatedDocument = await this.model
        .findByIdAndUpdate(id, data, { new: true })
        .exec();
      if (!updatedDocument) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }
      return updatedDocument;
    } catch (error) {
      // Log the error (optional)
      console.error('Error updating document:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a NotFoundException
      }
      throw new InternalServerErrorException('Failed to update the document');
    }
  }

  // Delete document by ID
  async delete(id: string): Promise<void> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Document with ID ${id} not found`);
      }
    } catch (error) {
      // Log the error (optional)
      console.error('Error deleting document:', error);
      if (error instanceof NotFoundException) {
        throw error; // Re-throw if it's a NotFoundException
      }
      throw new InternalServerErrorException('Failed to delete the document');
    }
  }
}
