import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface,
  ValidationArguments 
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ name: 'existsDivision', async: true })
@Injectable()
export class ExistsDivisionConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(id: number, args: ValidationArguments): Promise<boolean> {
    if (!id) return true; // Si no hay ID, es válido (campo opcional)

    const division = await this.prisma.division.findUnique({
      where: { id }
    });

    return !!division; // Retorna true si existe
  }

  defaultMessage(args: ValidationArguments): string {
    return `La división con ID ${args.value} no existe`;
  }
}

export function ExistsDivision(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ExistsDivisionConstraint,
    });
  };
}