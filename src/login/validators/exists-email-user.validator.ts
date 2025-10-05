import { Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ name: 'existsEmailUser', async: true })
@Injectable()
export class ExistsEmailUserValidator implements ValidatorConstraintInterface {
  // Aquí iría la lógica para validar si el email existe en la base de datos
  constructor(private readonly prisma: PrismaService) {}
  async validate(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return !!user; // Retorna true si existe
  }
  defaultMessage(): string {
    return 'El email no está registrado';
  }
}

export function ExistsEmailUser(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ExistsEmailUserValidator,
    });
  };
}
