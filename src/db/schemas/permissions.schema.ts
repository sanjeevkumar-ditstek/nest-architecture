import { Table, Column, DataType } from 'sequelize-typescript';
import { BaseModel } from './base.schema';

@Table({ tableName: 'permissions' })
export class Permission extends BaseModel {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  module!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false, // Action is mandatory
  })
  action!: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false, // Default for soft delete
  })
  isDeleted!: boolean;
}
