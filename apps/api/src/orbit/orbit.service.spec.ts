import { Test, TestingModule } from '@nestjs/testing';
import { OrbitService } from './orbit.service';
import { AiService } from '../ai/ai.service';
import { ConversationService } from '../conversation/conversation.service';
import { PromptService } from '../prompt/prompt.service';

describe('OrbitService', () => {
  let service: OrbitService;

  beforeEach(async () => {
    const mockAiService = {
      chat: jest.fn(),
    };
    const mockConversationService = {
      getOrCreateConversation: jest.fn().mockResolvedValue({
        id: 'mock-convo-id',
        messages: [],
      }),
      appendMessage: jest.fn(),
    };
    const mockPromptService = {
      buildSystemPrompt: jest.fn().mockResolvedValue('mock-system-prompt'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrbitService,
        { provide: AiService, useValue: mockAiService },
        { provide: ConversationService, useValue: mockConversationService },
        { provide: PromptService, useValue: mockPromptService },
      ],
    }).compile();

    service = module.get<OrbitService>(OrbitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
