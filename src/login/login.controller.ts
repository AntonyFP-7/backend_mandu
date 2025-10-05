import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  //creamos api de login
  @Post('login')
  @HttpCode(HttpStatus.OK) // Explícitamente devolver 200 en lugar de 201 para login
  async login(@Body() loginDto: LoginDto) {
    return await this.loginService.login(loginDto.email, loginDto.password);
  }
}
