import { Injectable } from '@nestjs/common';

export interface PromptContext {
  conversationId: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class PromptService {
  /**
   * Compiles the system prompt dynamically based on the provided context.
   * Future refinements (RAG, memories, personality configurations) can be integrated here
   * without affecting the orchestrator (OrbitService).
   */
  buildSystemPrompt(context: PromptContext): Promise<string> {
    // Currently returns a static base instruction.
    // In future phases, this will aggregate and template personality, memories, and RAG contexts.
    // Reference context to avoid unused-vars check
    Object.keys(context);
    return Promise.resolve(
      'You are Orbit, a personal AI assistant built with clean, scalable architecture. Assist the user with detailed, helpful responses.',
    );
  }
}
