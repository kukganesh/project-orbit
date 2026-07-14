import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrbitModule } from './orbit/orbit.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrbitModule,
    AiModule,
  ],
})
export class AppModule {}
