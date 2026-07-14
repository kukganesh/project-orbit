import { Injectable } from '@nestjs/common';
import { AiService } from '../ai/ai.service';

@Injectable()
export class OrbitService {
  constructor(
    private readonly aiService: AiService,
){}

  async chat(prompt: string): Promise<string> {
    return this.aiService.chat(prompt);
  }
}