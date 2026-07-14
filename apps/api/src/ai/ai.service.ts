import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private client: OpenAI;
  private readonly modelName: string;

  constructor(private readonly configService: ConfigService) {
    this.client = new OpenAI({
      apiKey: this.configService.get<string>('OPENROUTER_API_KEY'),
      baseURL: 'https://openrouter.ai/api/v1',
    });
    this.modelName =
      this.configService.get<string>('AI_MODEL') ??
      'nvidia/nemotron-3-ultra-550b-a55b:free';
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    const formattedMessages = messages.map((msg) => ({
      role: msg.role as 'system' | 'user' | 'assistant',
      content: msg.content,
    }));

    const response = await this.client.chat.completions.create({
      model: this.modelName,
      messages: formattedMessages,
    });

    return response.choices[0]?.message?.content ?? 'No response';
  }
}
