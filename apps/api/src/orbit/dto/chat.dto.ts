import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsOptional()
  conversationId?: string;
}
