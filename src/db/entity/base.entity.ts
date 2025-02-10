import { BaseEntity, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseModel extends BaseEntity {
  @CreateDateColumn({
    type: 'bigint',
    transformer: {
      to: () => Date.now(),
      from: (value: string | number) => Number(value),
    },
  })
  createdAt: number;

  @UpdateDateColumn({
    type: 'bigint',
    transformer: {
      to: () => Date.now(),
      from: (value: string | number) => Number(value),
    },
  })
  updatedAt: number;
}
