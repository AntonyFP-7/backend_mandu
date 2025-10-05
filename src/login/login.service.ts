import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HashService } from 'src/common/services/hash.service';

@Injectable()
export class LoginService {
  constructor(
    private prisma: PrismaService,
    private hashService: HashService,
  ) {}
  //creamos metodos para el login
  async login(email: string, password: string) {
    // Buscar el usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Usuario no encontrado',
        error: 'Not Found'
      });
    }

    // Verificar que el usuario esté activo
    if (!user.status) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Usuario desactivado. Contacte al administrador',
        error: 'Unauthorized'
      });
    }

    // Verificar la contraseña
    const passwordMatches = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException({
        statusCode: 401,
        message: 'Credenciales incorrectas',
        error: 'Unauthorized'
      });
    }
    
    const { password: _, ...userWithoutPassword } = user;
    return {
      statusCode: 200,
      message: 'Inicio de sesión exitoso',
      data: userWithoutPassword
    };
  }
}
