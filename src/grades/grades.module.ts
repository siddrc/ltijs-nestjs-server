import { Module } from '@nestjs/common';
import { GradesService } from './grades.service';

@Module({
  providers: [GradesService],
})
export class GradesModule {}
