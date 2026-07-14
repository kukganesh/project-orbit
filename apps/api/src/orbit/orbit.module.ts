import { Module } from '@nestjs/common';
import { OrbitController } from './orbit.controller';
import { OrbitService } from './orbit.service';
import { AiModule } from '../ai/ai.module';
import { ConversationModule } from '../conversation/conversation.module';
import { PromptModule } from '../prompt/prompt.module';

@Module({
  imports: [AiModule, ConversationModule, PromptModule],
  controllers: [OrbitController],
  providers: [OrbitService],
})
export class OrbitModule {}
