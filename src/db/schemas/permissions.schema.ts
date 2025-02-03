// import { Table, Column, DataType } from 'sequelize-typescript';
// import { BaseModel } from './base.schema';

// @Table({ tableName: 'permissions' })
// export class Permission extends BaseModel {
//   @Column({
//     type: DataType.UUID,
//     primaryKey: true,
//     defaultValue: DataType.UUIDV4,
//   })
//   id!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   module!: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false, // Action is mandatory
//   })
//   action!: string;

//   @Column({
//     type: DataType.BOOLEAN,
//     defaultValue: false, // Default for soft delete
//   })
//   isDeleted!: boolean;
// }


import { UUID, UUIDV4 } from 'sequelize';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';


@Entity('permissions')
export class Permission extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  module: string;

  @Column()
  action: string;

  @Column({ default: false })
  isDeleted: boolean;
}