import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTConfig } from 'src/config/jwt.config';
import { PrismaService } from 'src/app.service';
import { UserService } from 'src/user/user.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategie';

@Module({
  imports:[
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:getJWTConfig
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UserService, GoogleStrategy, JwtStrategy],
})
export class AuthModule {}
