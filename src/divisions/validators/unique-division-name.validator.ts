import { 
  registerDecorator, 
  ValidationOptions, 
  ValidatorConstraint, 
  ValidatorConstraintInterface,
  ValidationArguments 
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@ValidatorConstraint({ name: 'isUniqueDivisionName', async: true })
@Injectable()
export class IsUniqueDivisionNameConstraint implements ValidatorConstraintInterface {
  constructor(private readonly prisma: PrismaService) {}

  async validate(name: string, args: ValidationArguments): Promise<boolean> {
    if (!name) return true; // Si no hay nombre, deja que @IsString lo maneje

    // Obtener el ID actual desde el contexto (para updates)
    const currentId = (args.object as any).id;

    const existingDivision = await this.prisma.division.findFirst({
      where: {
        name: name,
        ...(currentId && { NOT: { id: currentId } })
      }
    });

    return !existingDivision; // Retorna true si NO existe (es único)
  }

  defaultMessage(args: ValidationArguments): string {
    return `Ya existe una división con el nombre ${args.value}`;
  }
}

export function IsUniqueDivisionName(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUniqueDivisionNameConstraint,
    });
  };
}