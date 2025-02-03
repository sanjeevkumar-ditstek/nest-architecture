// import { Column, DataType, Model } from 'sequelize-typescript';

// export abstract class BaseModel extends Model {
//   //   @ApiProperty({ description: 'created at' })
//   @Column({
//     type: DataType.BIGINT,
//     allowNull: true,
//     defaultValue: () => new Date().getTime(),
//   })
//   createdAt: number;

//   //   @ApiProperty({ description: 'updated at' })
//   @Column({
//     type: DataType.BIGINT,
//     allowNull: true,
//     defaultValue: () => new Date().getTime(),
//   })
//   updatedAt: number;
// }

import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm';

export abstract class BaseModel extends BaseEntity {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
