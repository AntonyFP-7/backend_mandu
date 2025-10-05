import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ExistsEmailUser } from '../validators/exists-email-user.validator';

export class LoginDto {
  @IsNotEmpty({ message: 'El email es obligatorio' })
  @IsEmail({}, { message: 'El email no es válido' })
  //agregamos la validacion del email
  //@ExistsEmailUser({ message: 'El email no está registrado' })
  email: string;
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @IsString({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;
}
