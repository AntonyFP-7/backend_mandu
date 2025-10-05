import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DivisionsModule } from './divisions/divisions.module';
import { PrismaModule } from './prisma/prisma.module';
import { CommonModule } from './common/common.module';
import { ExistsParentDivisionConstraint } from './divisions/validators/exists-parent-division.validator';
import { ExistsAmbassadorConstraint } from './divisions/validators/exists-ambassador.validator';
import { ExistsEmailUserValidator } from './login/validators/exists-email-user.validator';
import { LoginModule } from './login/login.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CommonModule,
    PrismaModule,
    DivisionsModule,
    LoginModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ExistsParentDivisionConstraint, 
    ExistsAmbassadorConstraint,
    ExistsEmailUserValidator
  ],
})
export class AppModule {}
