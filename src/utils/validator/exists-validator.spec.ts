import { Test, TestingModule } from '@nestjs/testing';
import { ExistsValidator } from './exists-validator';

describe('ExistsValidator', () => {
  let provider: ExistsValidator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExistsValidator],
    }).compile();

    provider = module.get<ExistsValidator>(ExistsValidator);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
