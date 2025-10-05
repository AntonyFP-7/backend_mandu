import { 
  Controller, 
  Delete, 
  Get, 
  Post, 
  Put, 
  Param, 
  Body, 
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { DivisionsService } from './divisions.service';
import { CreateDivisionDto } from './dto/create-division.dto';
import { UpdateDivisionDto } from './dto/update-division.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('api/v1')
export class DivisionsController {
  constructor(private readonly divisionsService: DivisionsService) {}

  // Obtener todas las divisiones
  @Get('divisions')
  async getDivisions() {
    return await this.divisionsService.findAll();
  }

  // Obtener divisiones por nivel (query parameter)
  @Get('divisions/level/:level')
  async getDivisionsByLevel(@Param('level', ParseIntPipe) level: number) {
    return await this.divisionsService.findByLevel(level);
  }

  // Verificar si un nombre está disponible
  @Get('divisions/check-name/:name')
  async checkNameAvailability(@Param('name') name: string) {
    const existingDivision = await this.divisionsService.findByName(name);
    return {
      name: name,
      available: !existingDivision,
      message: existingDivision 
        ? `El nombre "${name}" ya está en uso` 
        : `El nombre "${name}" está disponible`
    };
  }

  // Obtener divisiones hijas de un parent
  @Get('divisions/:parentId/children')
  async getChildrenDivisions(@Param('parentId', ParseIntPipe) parentId: number) {
    return await this.divisionsService.findChildren(parentId);
  }

  // Obtener una division por id
  @Get('divisions/:id')
  async getDivisionById(@Param('id', ParseIntPipe) id: number) {
    return await this.divisionsService.findOne(id);
  }

  // Crear una division
  @Post('divisions')
  @HttpCode(HttpStatus.CREATED)
  async createDivision(
    @Body() createData: CreateDivisionDto,
    @CurrentUser() user: any
  ) {
    console.log('Usuario autenticado:', user); // Para debugging
    return await this.divisionsService.create(createData);
  }

  // Actualizar una division
  @Put('divisions/:id')
  async updateDivision(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: UpdateDivisionDto
  ) {
    // Agregar el ID al objeto para la validación de nombre único
    (updateData as any).id = id;
    return await this.divisionsService.update(id, updateData);
  }

  // Eliminar una division
  @Delete('divisions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDivision(@Param('id', ParseIntPipe) id: number) {
    return await this.divisionsService.remove(id);
  }
}
