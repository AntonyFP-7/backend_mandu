import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DivisionsModule } from './divisions/divisions.module';
import { PrismaModule } from './prisma/prisma.module';
import { ExistsParentDivisionConstraint } from './divisions/validators/exists-parent-division.validator';
import { ExistsAmbassadorConstraint } from './divisions/validators/exists-ambassador.validator';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    DivisionsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    ExistsParentDivisionConstraint, 
    ExistsAmbassadorConstraint
  ],
})
export class AppModule {}
