import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface,
  ValidationArguments 
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ name: 'existsParentDivision', async: true })
@Injectable()
export class ExistsParentDivisionConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(parentId: number, args: ValidationArguments): Promise<boolean> {
    if (!parentId) return true; // Si no hay parentId, es válido (campo opcional)

    // Verificar que la división padre existe
    const parentDivision = await this.prisma.division.findUnique({
      where: { id: parentId }
    });

    if (!parentDivision) {
      return false; // No existe la división padre
    }

    // Obtener el ID actual desde el contexto (para updates)
    const currentId = (args.object as any).id;
    
    // Si hay currentId, verificar que no sea una referencia circular
    if (currentId && currentId === parentId) {
      return false; // Una división no puede ser padre de sí misma
    }

    return true; // La división padre existe y no hay referencia circular
  }

  defaultMessage(args: ValidationArguments): string {
    return `La división padre con ID ${args.value} no existe o crearía una referencia circular`;
  }
}

export function ExistsParentDivision(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: ExistsParentDivisionConstraint,
    });
  };
}