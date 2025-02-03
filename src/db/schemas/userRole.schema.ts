// import {
//   Table,
//   Column,
//   DataType,
//   ForeignKey,
//   BelongsTo,
// } from 'sequelize-typescript';
// import { User } from './user.schema';
// import { BaseModel } from './base.schema';
// import { Role } from './role.schema';
// import { Permission } from './permissions.schema';

// @Table({ tableName: 'userRoles', timestamps: true })
// export class UserRole extends BaseModel {
//   @Column({
//     type: DataType.UUID,
//     defaultValue: DataType.UUIDV4,
//     primaryKey: true,
//   })
//   id: string;
//   // user
//   @ForeignKey(() => User)
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   userId: string;
//   @BelongsTo(() => User, { as: 'user' })
//   user: User;

//   //  role
//   @ForeignKey(() => Role)
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   roleId: string;
//   @BelongsTo(() => Role, { as: 'role' })
//   role: Role;

//   // permission

//   @ForeignKey(() => Permission)
//   @Column({
//     type: DataType.UUID,
//     allowNull: false,
//   })
//   permissionId: string[];
//   @BelongsTo(() => Permission, { as: 'permissions' })
//   permissions: Permission[];

//   @Column({
//     type: DataType.BOOLEAN,
//     defaultValue: false,
//   })
//   isDeleted: boolean;
// }
// // npx sequelize-cli migration:generate --name create-usersxxxxxxxx

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BaseEntity,
} from 'typeorm';
import { User } from './user.schema';
import { Role } from './role.schema';
import { Permission } from './permissions.schema';
import { UUID, UUIDV4 } from 'sequelize';

@Entity('userRoles')
export class UserRole extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Role, (role) => role.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @ManyToOne(() => Permission, (permission) => permission.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'permissionId' })
  permission: Permission;

  @Column({ default: false })
  isDeleted: boolean;
}