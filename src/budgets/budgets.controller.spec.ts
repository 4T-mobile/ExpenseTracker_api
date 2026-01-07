import { Test, TestingModule } from '@nestjs/testing';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

describe('BudgetsController', () => {
  let controller: BudgetsController;

  const userId = 'user-id-123';

  const mockBudget = {
    id: 'budget-id-123',
    userId,
    amount: 500,
    periodType: 'MONTHLY' as const,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockBudgetsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findCurrent: jest.fn(),
    findOne: jest.fn(),
    getStatus: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BudgetsController],
      providers: [{ provide: BudgetsService, useValue: mockBudgetsService }],
    }).compile();

    controller = module.get<BudgetsController>(BudgetsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      amount: 500,
      periodType: 'MONTHLY' as const,
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    };

    it('should create a budget', async () => {
      mockBudgetsService.create.mockResolvedValue(mockBudget);

      const result = await controller.create(userId, createDto);

      expect(result).toEqual(mockBudget);
      expect(mockBudgetsService.create).toHaveBeenCalledWith(userId, createDto);
    });
  });

  describe('findAll', () => {
    it('should return all budgets', async () => {
      const budgets = [mockBudget];
      mockBudgetsService.findAll.mockResolvedValue(budgets);

      const result = await controller.findAll(userId, undefined);

      expect(result).toEqual(budgets);
      expect(mockBudgetsService.findAll).toHaveBeenCalledWith(userId, undefined);
    });

    it('should filter by isActive', async () => {
      mockBudgetsService.findAll.mockResolvedValue([mockBudget]);

      await controller.findAll(userId, true);

      expect(mockBudgetsService.findAll).toHaveBeenCalledWith(userId, true);
    });
  });

  describe('findCurrent', () => {
    it('should return current budget with status', async () => {
      const currentBudget = {
        ...mockBudget,
        spentAmount: 300,
        remainingAmount: 200,
        percentage: 60,
        daysRemaining: 15,
        isOverBudget: false,
      };
      mockBudgetsService.findCurrent.mockResolvedValue(currentBudget);

      const result = await controller.findCurrent(userId);

      expect(result).toEqual(currentBudget);
      expect(mockBudgetsService.findCurrent).toHaveBeenCalledWith(userId);
    });

    it('should return null if no current budget', async () => {
      mockBudgetsService.findCurrent.mockResolvedValue(null);

      const result = await controller.findCurrent(userId);

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a budget by id', async () => {
      mockBudgetsService.findOne.mockResolvedValue(mockBudget);

      const result = await controller.findOne(mockBudget.id, userId);

      expect(result).toEqual(mockBudget);
      expect(mockBudgetsService.findOne).toHaveBeenCalledWith(
        mockBudget.id,
        userId,
      );
    });
  });

  describe('getStatus', () => {
    it('should return budget status', async () => {
      const status = {
        ...mockBudget,
        spentAmount: 300,
        remainingAmount: 200,
        percentage: 60,
        daysRemaining: 15,
        isOverBudget: false,
      };
      mockBudgetsService.getStatus.mockResolvedValue(status);

      const result = await controller.getStatus(mockBudget.id, userId);

      expect(result).toEqual(status);
      expect(mockBudgetsService.getStatus).toHaveBeenCalledWith(
        mockBudget.id,
        userId,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      amount: 600,
    };

    it('should update a budget', async () => {
      const updatedBudget = { ...mockBudget, amount: 600 };
      mockBudgetsService.update.mockResolvedValue(updatedBudget);

      const result = await controller.update(mockBudget.id, userId, updateDto);

      expect(result).toEqual(updatedBudget);
      expect(mockBudgetsService.update).toHaveBeenCalledWith(
        mockBudget.id,
        userId,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a budget', async () => {
      const response = { message: 'Budget deleted successfully' };
      mockBudgetsService.remove.mockResolvedValue(response);

      const result = await controller.remove(mockBudget.id, userId);

      expect(result).toEqual(response);
      expect(mockBudgetsService.remove).toHaveBeenCalledWith(
        mockBudget.id,
        userId,
      );
    });
  });
});
