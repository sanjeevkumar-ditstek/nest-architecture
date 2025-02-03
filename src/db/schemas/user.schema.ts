// import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
// import { BaseModel } from './base.schema';
// import { UserRole } from './userRole.schema';

// @Table({ tableName: 'users' })
// export class User extends BaseModel {
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     primaryKey: true,
//   })
//   id: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true,
//   })
//   userName: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//     unique: true,
//   })
//   email: string;

//   @Column({
//     type: DataType.STRING,
//     allowNull: false,
//   })
//   password: string;

//   @Column({
//     type: DataType.BOOLEAN,
//     defaultValue: false,
//   })
//   isSuperAdmin: boolean;

//   @Column({
//     type: DataType.BOOLEAN,
//     defaultValue: false,
//   })
//   isDeleted: boolean;

//   @Column({
//     type: DataType.STRING,
//     allowNull: true,
//   })
//   providerToken: string;

//   @HasMany(() => UserRole, { as: 'userRoles' })
//   userRoles: UserRole[];
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
import { UserRole } from './userRole.schema';

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  isSuperAdmin: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ nullable: true })
  providerToken: string;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
