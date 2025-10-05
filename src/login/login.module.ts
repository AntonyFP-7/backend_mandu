import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { CommonModule } from '../common/common.module';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { SECRET } from 'src/config/enviroment';

@Module({
  imports: [
    CommonModule,
    PrismaModule,
    JwtModule.register({
      global: true,
      secret: SECRET ,
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [LoginController],
  providers: [LoginService],
})
export class LoginModule {}
