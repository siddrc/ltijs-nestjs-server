import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();
const SSL_BASED_ENVIRONMENTS = ['production', 'staging', 'development'];

export default new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['./migrations/*{.ts,.js}'],
  ssl: SSL_BASED_ENVIRONMENTS.includes(process.env.NODE_ENV)
    ? { rejectUnauthorized: false }
    : false,
});
