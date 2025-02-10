import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
require('dotenv').config()
console.log(process.env.DB_DATABASE,"FDGYHIJO")
let connectionOptions: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: ['src/db/entity/*.entity{.ts,.js}'],
  migrations: ['src/db/migrations/*{.ts,.js}'],
};

export default new DataSource({
  ...connectionOptions,
});
