import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DivisionsModule } from './divisions/divisions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DivisionsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
