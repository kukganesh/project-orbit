import { Conversation } from '../interfaces/message.interface';

export abstract class ConversationStorage {
  abstract getConversation(id: string): Promise<Conversation | null>;
  abstract saveConversation(conversation: Conversation): Promise<void>;
}
