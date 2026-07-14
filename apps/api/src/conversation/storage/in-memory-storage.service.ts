import { Injectable } from '@nestjs/common';
import { Conversation } from '../interfaces/message.interface';
import { ConversationStorage } from './conversation-storage.interface';

@Injectable()
export class InMemoryStorageService implements ConversationStorage {
  private readonly storage = new Map<string, Conversation>();

  getConversation(id: string): Promise<Conversation | null> {
    const convo = this.storage.get(id);
    if (!convo) {
      return Promise.resolve(null);
    }
    // Return a deep copy to prevent external mutation issues
    return Promise.resolve({
      ...convo,
      messages: [...convo.messages],
    });
  }

  saveConversation(conversation: Conversation): Promise<void> {
    this.storage.set(conversation.id, {
      ...conversation,
      messages: [...conversation.messages],
    });
    return Promise.resolve();
  }
}
