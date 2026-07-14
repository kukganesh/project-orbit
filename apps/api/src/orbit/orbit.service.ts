import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { ConversationService } from '../conversation/conversation.service';
import { PromptService } from '../prompt/prompt.service';

@Injectable()
export class OrbitService {
  constructor(
    private readonly aiService: AiService,
    private readonly conversationService: ConversationService,
    private readonly promptService: PromptService,
  ) {}

  async chat(
    prompt: string,
    conversationId?: string,
  ): Promise<{ conversationId: string; response: string }> {
    // 1. Get or create the conversation session
    const conversation =
      await this.conversationService.getOrCreateConversation(conversationId);

    // 2. Build the dynamic system prompt based on the context
    const systemPromptText = await this.promptService.buildSystemPrompt({
      conversationId: conversation.id,
    });

    // 3. Construct the list of messages including history and the new user prompt
    const messages = [
      { role: 'system', content: systemPromptText },
      ...conversation.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: prompt },
    ];

    // 4. Request the AI response
    const responseText = await this.aiService.chat(messages);

    // 5. Append both messages to the persistent history on success
    await this.conversationService.appendMessage(
      conversation.id,
      'user',
      prompt,
    );
    await this.conversationService.appendMessage(
      conversation.id,
      'assistant',
      responseText,
    );

    return {
      conversationId: conversation.id,
      response: responseText,
    };
  }
}
