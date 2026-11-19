import { Test, TestingModule } from '@nestjs/testing';
import { CustomizationsService } from './customizations.service';

describe('CustomizationsService', () => {
  let service: CustomizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CustomizationsService],
    }).compile();

    service = module.get<CustomizationsService>(CustomizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
