import { Test, TestingModule } from '@nestjs/testing';
import { Conversation } from './conversation';

describe('Conversation', () => {
  let provider: Conversation;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Conversation],
    }).compile();

    provider = module.get<Conversation>(Conversation);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
