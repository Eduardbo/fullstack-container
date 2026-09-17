import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { KnexModule } from 'nest-knexjs';
import { UsersDao } from '../users/users.dao';
import { AuthService } from './auth.service';
import { MsAuthController } from './ms-auth.controller';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const secret = config.get<string>('JWT_SECRET');

        if (!secret) {
          throw new Error('JWT_SECRET não foi definido no ambiente');
        }

        return {
          secret,
          signOptions: {
            expiresIn: '1h',
            issuer: 'aplication-auth',
          },
        };
      },
    }),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        config: {
          client: 'mysql2',
          connection: {
            host: config.get<string>('DB_HOST', '127.0.0.1'),
            port: Number(config.get<number>('DB_PORT', 3306)),
            user: config.get<string>('DB_USER', 'root'),
            password: config.get<string>('DB_PASSWORD', ''),
            database: config.get<string>('DB_NAME', 'painel_login'),
          },
          pool: {
            min: 0,
            max: 10,
            acquireTimeoutMillis: 30000,
          },
        },
      }),
    }),
  ],
  controllers: [MsAuthController],
  providers: [AuthService, UsersDao],
  exports: [AuthService],
})
export class  AuthModule {}
