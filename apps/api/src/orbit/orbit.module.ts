import { Module } from '@nestjs/common';
import { OrbitController } from './orbit.controller';
import { OrbitService } from './orbit.service';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  controllers: [OrbitController],
  providers: [OrbitService],
})
export class OrbitModule {}