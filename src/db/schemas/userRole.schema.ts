import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from './user.schema';
import { BaseModel } from './base.schema';
import { Role } from './role.schema';
import { Permission } from './permissions.schema';

@Table({ tableName: 'userRoles', timestamps: true })
export class UserRole extends BaseModel {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;
  // user
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;
  @BelongsTo(() => User, { as: 'user' })
  user: User;

  //  role
  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roleId: string;
  @BelongsTo(() => Role, { as: 'role' })
  role: Role;

  // permission

  @ForeignKey(() => Permission)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  permissionId: string[];
  @BelongsTo(() => Permission, { as: 'permissions' })
  permissions: Permission[];

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  isDeleted: boolean;
}
// npx sequelize-cli migration:generate --name create-usersxxxxxxxx
