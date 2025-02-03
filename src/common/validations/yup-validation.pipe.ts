import { Injectable, PipeTransform, ArgumentMetadata,  BadRequestException } from '@nestjs/common';
import {  Schema, ValidationError } from 'yup';
import * as yup from 'yup';

@Injectable()
export class YupValidationPipe implements PipeTransform {
  constructor(private readonly schema: yup.ObjectSchema<any>) {}

  async transform(value: any, metadata: ArgumentMetadata) { 
    try {
      metadata
      value
      if(metadata.type === 'body'){
        // Validate the input data against the schema
      await this.schema.validate(value, { abortEarly: false });
      return value;
      }else{
      return true
      }
      
    } catch (errors) {
      // Check if errors is an array, otherwise wrap it in an array
      const formattedErrors = Array.isArray(errors) ? errors : [errors];
      throw new BadRequestException({
        message: 'Validation error',
        errors: this.formatErrors(formattedErrors),
        statusCode: 400,
      });
    }
  }

  private formatErrors(errors: ValidationError[]) {
    return errors.map((error) => ({
      field: error.path,
      message:
        error.message ||
        `${error.path.charAt(0).toUpperCase() + error.path.slice(1)} is invalid`,
    }));
  }
}
