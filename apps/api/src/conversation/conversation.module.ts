import { Module } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationStorage } from './storage/conversation-storage.interface';
import { InMemoryStorageService } from './storage/in-memory-storage.service';

@Module({
  providers: [
    ConversationService,
    {
      provide: ConversationStorage,
      useClass: InMemoryStorageService,
    },
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
