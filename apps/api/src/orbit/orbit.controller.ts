import { Body, Controller, Post } from '@nestjs/common';
import { OrbitService } from './orbit.service';

@Controller('orbit')
export class OrbitController {
  constructor(
    private readonly orbitService: OrbitService,
  ) {}

  @Post('chat')
  async chat(
    @Body() body: { prompt: string },
  ) {
    return {
      response: await this.orbitService.chat(body.prompt),
    };
  }
}