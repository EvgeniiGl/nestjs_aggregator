import { Test, TestingModule } from '@nestjs/testing'
import { AdminHotelsController } from './admin-hotels.controller'
import { HotelsService } from './hotels.service'

describe('AdminHotelsController', () => {
  let controller: AdminHotelsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminHotelsController],
      providers: [HotelsService]
    }).compile()

    controller = module.get<AdminHotelsController>(AdminHotelsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
