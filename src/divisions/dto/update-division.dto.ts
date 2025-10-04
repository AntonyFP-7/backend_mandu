import { IsString, IsInt, IsBoolean, IsOptional, Min, Max, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateDivisionDto {
  @IsOptional()
  @IsString()
  @MaxLength(45, { message: 'El nombre no puede exceder 45 caracteres' })
  name?: string;

  @IsOptional()
  @IsInt({ message: 'El nivel debe ser un número entero' })
  @Min(1, { message: 'El nivel debe ser mayor a 0' })
  @Max(9, { message: 'El nivel no puede ser mayor a 9' })
  @Type(() => Number)
  level?: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;

  @IsOptional()
  @IsInt({ message: 'El ID del parent debe ser un número entero' })
  @Type(() => Number)
  parentId?: number;

  @IsOptional()
  @IsInt({ message: 'El ID del ambassador debe ser un número entero' })
  @Type(() => Number)
  ambassadorId?: number;
}