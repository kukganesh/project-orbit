import { Injectable } from '@nestjs/common';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class OrbitService {
  constructor(
    private readonly geminiService: GeminiService,
  ) {}

  async chat(prompt: string): Promise<string> {
    return this.geminiService.chat(prompt);
  }
}