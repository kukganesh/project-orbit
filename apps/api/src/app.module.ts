import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrbitModule } from './orbit/orbit.module';
import { GeminiModule } from './gemini/gemini.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    OrbitModule,
    GeminiModule,
  ],
})
export class AppModule {}