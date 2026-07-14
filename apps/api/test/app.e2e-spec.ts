import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AiService } from '../src/ai/ai.service';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Orbit (e2e)', () => {
  let app: INestApplication<App>;
  const mockAiService = {
    chat: jest.fn().mockResolvedValue('Hello from AI!'),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AiService)
      .useValue(mockAiService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());
    await app.init();
  });

  it('/orbit/chat (POST) - new conversation', () => {
    return request(app.getHttpServer())
      .post('/orbit/chat')
      .send({ prompt: 'Hello' })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          success: true,
          data: {
            conversationId: expect.any(String) as unknown,
            response: 'Hello from AI!',
          },
          meta: {
            timestamp: expect.any(String) as unknown,
          },
        });
      });
  });

  it('/orbit/chat (POST) - continue conversation', async () => {
    // First request
    let conversationId = '';
    await request(app.getHttpServer())
      .post('/orbit/chat')
      .send({ prompt: 'Hello' })
      .expect(201)
      .expect((res) => {
        const body = res.body as { data: { conversationId: string } };
        conversationId = body.data.conversationId;
        expect(conversationId).toBeDefined();
      });

    // Second request using the generated ID
    return request(app.getHttpServer())
      .post('/orbit/chat')
      .send({ prompt: 'Continue', conversationId })
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual({
          success: true,
          data: {
            conversationId,
            response: 'Hello from AI!',
          },
          meta: {
            timestamp: expect.any(String) as unknown,
          },
        });
      });
  });

  afterEach(async () => {
    await app.close();
  });
});
