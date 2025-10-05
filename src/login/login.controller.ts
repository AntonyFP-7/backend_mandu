import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('api/v1')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  //creamos api de login
  @Public() // Marcar como ruta pública (sin autenticación)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    return await this.loginService.login(loginDto.email, loginDto.password);
  }
}
