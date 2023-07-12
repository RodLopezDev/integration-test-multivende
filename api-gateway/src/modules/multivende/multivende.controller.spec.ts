import { Test, TestingModule } from '@nestjs/testing';
import { MultivendeController } from './multivende.controller';

describe('MultivendeController', () => {
  let controller: MultivendeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultivendeController],
      providers: [],
    }).compile();

    controller = module.get<MultivendeController>(MultivendeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
