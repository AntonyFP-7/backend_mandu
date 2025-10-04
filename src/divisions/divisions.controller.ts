import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('api/v1')
export class DivisionsController {
  //obtener todas las divisiones
  @Get('divisions')
  getDivisions() {
    return 'Aquí van las divisiones';
  }
  //obtener una division por id
  @Get('divisions/:id')
  getDivisionById() {
    return 'Aquí va una division por id';
  }
  //crear una division
  @Post('divisions')
  createDivision() {
    return 'Aquí se crea una division';
  }
  //actualizar una division
  @Put('divisions/:id')
  updateDivision() {
    return 'Aquí se actualiza una division';
  }
  //eliminar una division
  @Delete('divisions/:id')
  deleteDivision() {
    return 'Aquí se elimina una division';
  }
}
