import { Test, TestingModule } from '@nestjs/testing';
import { ConversationService } from './conversation.service';
import { ConversationStorage } from './storage/conversation-storage.interface';
import { Conversation } from './interfaces/message.interface';

describe('ConversationService', () => {
  let service: ConversationService;

  const mockStorage = {
    getConversation: jest.fn(),
    saveConversation: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConversationService,
        {
          provide: ConversationStorage,
          useValue: mockStorage,
        },
      ],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getOrCreateConversation', () => {
    it('should return existing conversation if found', async () => {
      const mockConvo: Conversation = {
        id: 'existing-id',
        messages: [],
        createdAt: 'time',
        updatedAt: 'time',
      };
      mockStorage.getConversation.mockResolvedValue(mockConvo);

      const result = await service.getOrCreateConversation('existing-id');

      expect(mockStorage.getConversation).toHaveBeenCalledWith('existing-id');
      expect(result).toEqual(mockConvo);
    });

    it('should create new conversation if not found or id not provided', async () => {
      mockStorage.getConversation.mockResolvedValue(null);

      const result = await service.getOrCreateConversation();

      expect(result.id).toBeDefined();
      expect(result.messages).toEqual([]);
      expect(mockStorage.saveConversation).toHaveBeenCalled();
    });
  });

  describe('appendMessage', () => {
    it('should append a new message and save conversation', async () => {
      const mockConvo: Conversation = {
        id: 'convo-id',
        messages: [],
        createdAt: 'time',
        updatedAt: 'time',
      };
      mockStorage.getConversation.mockResolvedValue(mockConvo);

      const msg = await service.appendMessage('convo-id', 'user', 'Hello');

      expect(msg.role).toBe('user');
      expect(msg.content).toBe('Hello');
      expect(mockConvo.messages).toContain(msg);
      expect(mockStorage.saveConversation).toHaveBeenCalledWith(mockConvo);
    });
  });
});
