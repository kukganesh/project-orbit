export type MessageRole = 'system' | 'user' | 'assistant';

export interface ConversationMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface Conversation {
  id: string;
  messages: ConversationMessage[];
  createdAt: string;
  updatedAt: string;
}
