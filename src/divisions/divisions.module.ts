import { Module } from '@nestjs/common';
import { DivisionsController } from './divisions.controller';
import { DivisionsService } from './divisions.service';
import { IsUniqueDivisionNameConstraint } from './validators/unique-division-name.validator';

@Module({
  controllers: [DivisionsController],
  providers: [DivisionsService, IsUniqueDivisionNameConstraint]
})
export class DivisionsModule {}
