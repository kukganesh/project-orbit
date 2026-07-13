import { Module } from '@nestjs/common';
import { OrbitController } from './orbit.controller';
import { OrbitService } from './orbit.service';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [GeminiModule],
  controllers: [OrbitController],
  providers: [OrbitService],
})
export class OrbitModule {}
