import { Test, TestingModule } from '@nestjs/testing';
import { CustomizationsController } from './customizations.controller';
import { CustomizationsService } from './customizations.service';

describe('CustomizationsController', () => {
  let controller: CustomizationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomizationsController],
      providers: [CustomizationsService],
    }).compile();

    controller = module.get<CustomizationsController>(CustomizationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
