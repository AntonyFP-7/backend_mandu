import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HashService {
  private readonly saltRounds = 10;

  /**
   * Hashea una contraseña usando bcrypt
   * @param password - La contraseña en texto plano
   * @returns La contraseña hasheada
   */
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Compara una contraseña en texto plano con una contraseña hasheada
   * @param password - La contraseña en texto plano
   * @param hashedPassword - La contraseña hasheada almacenada
   * @returns true si las contraseñas coinciden, false si no
   */
  async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Valida si una contraseña cumple con los requisitos mínimos
   * @param password - La contraseña a validar
   * @returns true si es válida, false si no
   */
  validatePassword(password: string): boolean {
    // Mínimo 8 caracteres, al menos una letra y un número
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasLetter && hasNumber;
  }
}