import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import {
  Conversation,
  ConversationMessage,
  MessageRole,
} from './interfaces/message.interface';
import { ConversationStorage } from './storage/conversation-storage.interface';

@Injectable()
export class ConversationService {
  constructor(private readonly storage: ConversationStorage) {}

  async getOrCreateConversation(id?: string): Promise<Conversation> {
    if (id) {
      const existing = await this.storage.getConversation(id);
      if (existing) {
        return existing;
      }
    }

    const conversationId = id || randomUUID();
    const newConvo: Conversation = {
      id: conversationId,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await this.storage.saveConversation(newConvo);
    return newConvo;
  }

  async appendMessage(
    conversationId: string,
    role: MessageRole,
    content: string,
    metadata?: Record<string, any>,
  ): Promise<ConversationMessage> {
    const convo = await this.storage.getConversation(conversationId);
    if (!convo) {
      throw new NotFoundException(
        `Conversation with ID ${conversationId} not found`,
      );
    }

    const newMessage: ConversationMessage = {
      id: randomUUID(),
      role,
      content,
      timestamp: new Date().toISOString(),
      metadata,
    };

    convo.messages.push(newMessage);
    convo.updatedAt = new Date().toISOString();
    await this.storage.saveConversation(convo);

    return newMessage;
  }
}
