import { Body, Controller, Post } from '@nestjs/common';
import { OrbitService } from './orbit.service';
import { ChatDto } from './dto/chat.dto';

@Controller('orbit')
export class OrbitController {
  constructor(private readonly orbitService: OrbitService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    return this.orbitService.chat(chatDto.prompt, chatDto.conversationId);
  }
}
