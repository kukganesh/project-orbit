import { Test, TestingModule } from '@nestjs/testing';
import { OrbitController } from './orbit.controller';
import { OrbitService } from './orbit.service';

describe('OrbitController', () => {
  let controller: OrbitController;

  beforeEach(async () => {
    const mockOrbitService = {
      chat: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrbitController],
      providers: [
        {
          provide: OrbitService,
          useValue: mockOrbitService,
        },
      ],
    }).compile();

    controller = module.get<OrbitController>(OrbitController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
