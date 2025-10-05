import { Injectable } from '@nestjs/common';
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
      throw new Error('Usuario no encontrado');
    }

    // Verificar la contraseña
    const passwordMatches = await this.hashService.comparePassword(
      password,
      user.password,
    );

    if (!passwordMatches) {
      throw new Error('Contraseña incorrecta');
    }
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
