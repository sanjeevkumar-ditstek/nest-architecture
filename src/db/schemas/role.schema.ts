// import {
//   Table,
//   Column,
//   DataType,
//   PrimaryKey,
//   Default,
// } from 'sequelize-typescript';
// import { BaseModel } from './base.schema';

// @Table({ tableName: 'roles' })
// export class Role extends BaseModel {
//   @PrimaryKey
//   @Default(DataType.UUIDV4) // Automatically generate UUID
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   id!: string;

//   @Column({
//     type: DataType.STRING,
//     unique: true, // Ensure the role name is unique
//     allowNull: false,
//   })
//   role: string;

//   @Column({
//     type: DataType.INTEGER,
//     allowNull: false,
//     defaultValue: 0, // Default to 0 for level
//   })
//   level!: number;

//   @Column({
//     type: DataType.BOOLEAN,
//     defaultValue: false,
//   })
//   isDeleted: boolean;
// }

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';

@Entity('roles')
export class Role extends BaseEntity{
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  role: string;

  @Column({ default: 0 })
  level: number;

  @Column({ default: false })
  isDeleted: boolean;
}