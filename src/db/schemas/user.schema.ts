import { Column, DataType, Table, HasMany } from 'sequelize-typescript';
import { BaseModel } from './base.schema';
import { UserRole } from './userRole.schema';

@Table({ tableName: 'users' })
export class User extends BaseModel {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  userName: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  password: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isSuperAdmin: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  providerToken: string;

  @HasMany(() => UserRole, { as: 'userRoles' })
  userRoles: UserRole[];
}
