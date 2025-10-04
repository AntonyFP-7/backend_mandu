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
  async createDivision(@Body() createData: {
    name: string;
    level: number;
    status?: boolean;
    parentId?: number;
    ambassadorId?: number;
  }) {
    return await this.divisionsService.create(createData);
  }

  // Actualizar una division
  @Put('divisions/:id')
  async updateDivision(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateData: {
      name?: string;
      level?: number;
      status?: boolean;
      parentId?: number;
      ambassadorId?: number;
    }
  ) {
    return await this.divisionsService.update(id, updateData);
  }

  // Eliminar una division
  @Delete('divisions/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDivision(@Param('id', ParseIntPipe) id: number) {
    return await this.divisionsService.remove(id);
  }
}
