import {
  IsString,
  IsInt,
  IsBoolean,
  IsOptional,
  Min,
  Max,
  MaxLength,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ExistsParentDivision } from '../validators/exists-parent-division.validator';
import { ExistsAmbassador } from '../validators/exists-ambassador.validator';

export class CreateDivisionDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(45, { message: 'El nombre no puede exceder 45 caracteres' })
  name: string;

  @IsInt({ message: 'El nivel debe ser un número entero' })
  @Min(1, { message: 'El nivel debe ser mayor a 0' })
  @Max(9, { message: 'El nivel no puede ser mayor a 9' })
  @Type(() => Number)
  level: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean = true;

  @IsOptional()
  @IsInt({ message: 'El ID del parent debe ser un número entero' })
  @Type(() => Number)
  @ExistsParentDivision({ message: 'La división padre no existe o crearía una referencia circular' })
  parentId?: number;

  @IsOptional()
  @IsInt({ message: 'El ID del ambassador debe ser un número entero' })
  @Type(() => Number)
  @ExistsAmbassador({ message: 'El embajador no existe' })
  ambassadorId?: number;
}
