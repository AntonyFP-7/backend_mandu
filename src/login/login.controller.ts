import { Body, Controller, Post } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';

@Controller('api/v1')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  //creamos api de login
  @Post('login')
  async login(
    @Body() body: LoginDto
 ) {
    return await this.loginService.login( body.email, body.password );
  }
}
