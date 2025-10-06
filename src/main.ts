import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PORT } from './config/enviroment';
import { ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configurar class-validator para usar el contenedor de NestJS
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
  // Configurar ValidationPipe globalmente
  app.useGlobalPipes(new ValidationPipe({
    transform: true,      // Transforma automáticamente los tipos
    whitelist: true,      // Remueve propiedades que no están en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
    transformOptions: {
      enableImplicitConversion: true, // Conversión automática de tipos
    },
  }));
  app.enableCors(); // Habilitar CORS si es necesario
  const configService = app.get(ConfigService);  
  const port = configService.get<number>(PORT, 3000); 
  await app.listen(port);
}
bootstrap();
