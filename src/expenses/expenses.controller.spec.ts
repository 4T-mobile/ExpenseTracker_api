import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';

describe('ExpensesController', () => {
  let controller: ExpensesController;

  const userId = 'user-id-123';
  const categoryId = 'category-id-123';

  const mockExpense = {
    id: 'expense-id-123',
    name: 'Lunch',
    amount: 15.5,
    categoryId,
    userId,
    date: new Date('2024-01-15'),
    notes: 'Pizza',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: categoryId,
      name: 'Food',
      icon: '🍔',
      color: '#FF6B6B',
    },
  };

  const mockExpensesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findRecent: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [{ provide: ExpensesService, useValue: mockExpensesService }],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Lunch',
      amount: 15.5,
      categoryId,
      date: '2024-01-15',
      notes: 'Pizza',
    };

    it('should create an expense', async () => {
      mockExpensesService.create.mockResolvedValue(mockExpense);

      const result = await controller.create(userId, createDto);

      expect(result).toEqual(mockExpense);
      expect(mockExpensesService.create).toHaveBeenCalledWith(userId, createDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated expenses', async () => {
      const response = {
        expenses: [mockExpense],
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };
      mockExpensesService.findAll.mockResolvedValue(response);

      const query = { page: 1, limit: 10 };
      const result = await controller.findAll(userId, query);

      expect(result).toEqual(response);
      expect(mockExpensesService.findAll).toHaveBeenCalledWith(userId, query);
    });

    it('should apply filters', async () => {
      const response = { expenses: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
      mockExpensesService.findAll.mockResolvedValue(response);

      const query = {
        startDate: '2024-01-01',
        endDate: '2024-01-31',
        categoryId,
      };
      await controller.findAll(userId, query);

      expect(mockExpensesService.findAll).toHaveBeenCalledWith(userId, query);
    });
  });

  describe('findRecent', () => {
    it('should return recent expenses with default limit', async () => {
      const expenses = [mockExpense];
      mockExpensesService.findRecent.mockResolvedValue(expenses);

      const result = await controller.findRecent(userId, undefined);

      expect(result).toEqual(expenses);
      expect(mockExpensesService.findRecent).toHaveBeenCalledWith(
        userId,
        undefined,
      );
    });

    it('should return recent expenses with custom limit', async () => {
      mockExpensesService.findRecent.mockResolvedValue([mockExpense]);

      await controller.findRecent(userId, 10);

      expect(mockExpensesService.findRecent).toHaveBeenCalledWith(userId, 10);
    });
  });

  describe('findOne', () => {
    it('should return an expense by id', async () => {
      mockExpensesService.findOne.mockResolvedValue(mockExpense);

      const result = await controller.findOne(mockExpense.id, userId);

      expect(result).toEqual(mockExpense);
      expect(mockExpensesService.findOne).toHaveBeenCalledWith(
        mockExpense.id,
        userId,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Lunch',
      amount: 20.0,
    };

    it('should update an expense', async () => {
      const updatedExpense = { ...mockExpense, ...updateDto };
      mockExpensesService.update.mockResolvedValue(updatedExpense);

      const result = await controller.update(mockExpense.id, userId, updateDto);

      expect(result).toEqual(updatedExpense);
      expect(mockExpensesService.update).toHaveBeenCalledWith(
        mockExpense.id,
        userId,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete an expense', async () => {
      const response = { message: 'Expense deleted successfully' };
      mockExpensesService.remove.mockResolvedValue(response);

      const result = await controller.remove(mockExpense.id, userId);

      expect(result).toEqual(response);
      expect(mockExpensesService.remove).toHaveBeenCalledWith(
        mockExpense.id,
        userId,
      );
    });
  });
});
