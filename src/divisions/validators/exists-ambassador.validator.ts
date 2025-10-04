import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface,
  ValidationArguments 
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ name: 'existsAmbassador', async: true })
@Injectable()
export class ExistsAmbassadorConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: number, args: ValidationArguments): Promise<boolean> {
    if (!id) return true; // Si no hay ID, es válido (campo opcional)

    const ambassador = await this.prisma.ambassador.findUnique({
      where: { id }
    });

    return !!ambassador; // Retorna true si existe
  }

  defaultMessage(args: ValidationArguments): string {
    return `El embajador con ID ${args.value} no existe`;
  }
}

export function ExistsAmbassador(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ExistsAmbassadorConstraint,
    });
  };
}