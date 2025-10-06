import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class DivisionsService {
  constructor(private prisma: PrismaService) {}

  // Obtener todas las divisiones
  async findAll() {
    try {
      return await this.prisma.division.findMany({
        include: {
          ambassador: true,
          parent: true,
          children: true,
          employees: true,
        },
        orderBy: [{ level: 'asc' }, { name: 'asc' }],
      });
    } catch (error) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error al obtener divisiones',
        error: error.message,
      });
    }
  }

  // Obtener una división por ID
  async findOne(id: number) {
    try {
      const division = await this.prisma.division.findUnique({
        where: { id },
        include: {
          ambassador: true,
          parent: true,
          children: true,
          employees: true,
        },
      });

      if (!division) {
        throw new NotFoundException({
          statusCode: 404,
          message: `División con ID ${id} no encontrada`,
          error: 'no found',
        });
      }

      return division;
    } catch (error) {
      throw new NotFoundException({
        statusCode: 404,
        message: error.message,
      });
    }
  }

  // Obtener una división por nombre
  async findByName(name: string) {
    try {
      return await this.prisma.division.findFirst({
        where: { name },
        include: {
          ambassador: true,
          parent: true,
          children: true,
        },
      });
    } catch (error) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error al buscar división por nombre',
        error: error.message,
      });
    }
  }

  // Crear una nueva división
  async create(divisionData: CreateDivisionDto) {
    try {
      // Validación de nombre único
      const existingDivision = await this.findByName(divisionData.name);
      if (existingDivision) {
        throw new ConflictException(
          `Ya existe una división con el nombre "${divisionData.name}"`,
        );
      }

      return await this.prisma.division.create({
        data: {
          name: divisionData.name.trim(),
          level: divisionData.level,
          status: divisionData.status ?? true,
          parentId: divisionData.parentId || null,
          ambassadorId: divisionData.ambassadorId || null,
        },
        include: {
          ambassador: true,
          parent: true,
          children: true,
        },
      });
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }

      // Manejar errores específicos de Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El nombre de la división ya existe');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'El ID de referencia proporcionado no existe',
          );
        }
      }
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error al crear división',
      });
    }
  }

  // Actualizar una división
  async update(id: number, updateData: UpdateDivisionDto) {
    try {
      // Verificar que la división existe
      await this.findOne(id);

      // Si se está actualizando el nombre, verificar que no esté duplicado
      if (updateData.name) {
        const existingDivision = await this.findByName(updateData.name);
        if (existingDivision && existingDivision.id !== id) {
          throw new ConflictException(
            `Ya existe una división con el nombre "${updateData.name}"`,
          );
        }
      }

      return await this.prisma.division.update({
        where: { id },
        data: {
          ...(updateData.name && { name: updateData.name.trim() }),
          ...(updateData.level && { level: updateData.level }),
          ...(updateData.status !== undefined && { status: updateData.status }),
          ...(updateData.parentId !== undefined && {
            parentId: updateData.parentId,
          }),
          ...(updateData.ambassadorId !== undefined && {
            ambassadorId: updateData.ambassadorId,
          }),
        },
        include: {
          ambassador: true,
          parent: true,
          children: true,
        },
      });
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Manejar errores específicos de Prisma
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('El nombre de la división ya existe');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException(
            'El ID de referencia proporcionado no existe',
          );
        }
      }
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error al actualizar división',
      });
    }
  }

  // Eliminar una división
  async remove(id: number) {
    try {
      // Verificar que la división existe
      await this.findOne(id);
      //verificar que no tenga empleados asignados
      const employees = await this.prisma.employee.findMany({
        where: { divisionId: id },
      });
      if (employees.length > 0) {
        throw new NotFoundException({
          statusCode: 404,
          message:
            'No se puede eliminar una división que tiene empleados asignados',
        });
      }

      // Verificar que no tenga divisiones hijas
      const children = await this.prisma.division.findMany({
        where: { parentId: id },
      });

      if (children.length > 0) {
        throw new NotFoundException({
          statusCode: 404,
          message: 'No se puede eliminar una división que tiene subdivisiones',
        });
      }

      return await this.prisma.division.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException({
        statusCode: 404,
        message: error.message,
      });
    }
  }

  // Obtener divisiones por nivel
  async findByLevel(level: number) {
    try {
      return await this.prisma.division.findMany({
        where: { level },
        include: {
          ambassador: true,
          parent: true,
          children: true,
        },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error al obtener divisiones por nivel',
      });
    }
  }

  // Obtener divisiones hijas de un parent
  async findChildren(parentId: number) {
    try {
      return await this.prisma.division.findMany({
        where: { parentId },
        include: {
          ambassador: true,
          children: true,
        },
        orderBy: { name: 'asc' },
      });
    } catch (error) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'Error al obtener divisiones hijas',
      });
    }
  }
}
