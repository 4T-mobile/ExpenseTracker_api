import { Test, TestingModule } from '@nestjs/testing';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';

describe('StatisticsController', () => {
  let controller: StatisticsController;

  const userId = 'user-id-123';

  const mockStatisticsService = {
    getDashboard: jest.fn(),
    getDailyStatistics: jest.fn(),
    getMonthlyStatistics: jest.fn(),
    getCategoryStatistics: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatisticsController],
      providers: [
        { provide: StatisticsService, useValue: mockStatisticsService },
      ],
    }).compile();

    controller = module.get<StatisticsController>(StatisticsController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDashboard', () => {
    it('should return dashboard statistics', async () => {
      const dashboard = {
        todayTotal: 50,
        weekTotal: 200,
        monthTotal: 800,
        topCategories: [],
        recentExpenses: [],
        budgetStatus: null,
        averageDailySpending: 25,
      };
      mockStatisticsService.getDashboard.mockResolvedValue(dashboard);

      const result = await controller.getDashboard(userId);

      expect(result).toEqual(dashboard);
      expect(mockStatisticsService.getDashboard).toHaveBeenCalledWith(userId);
    });
  });

  describe('getDailyStatistics', () => {
    it('should return daily statistics', async () => {
      const dailyStats = [
        { date: '2024-01-01', total: 50, count: 2 },
        { date: '2024-01-02', total: 75, count: 3 },
      ];
      mockStatisticsService.getDailyStatistics.mockResolvedValue(dailyStats);

      const result = await controller.getDailyStatistics(
        userId,
        '2024-01-01',
        '2024-01-31',
      );

      expect(result).toEqual(dailyStats);
      expect(mockStatisticsService.getDailyStatistics).toHaveBeenCalledWith(
        userId,
        '2024-01-01',
        '2024-01-31',
      );
    });
  });

  describe('getMonthlyStatistics', () => {
    it('should return monthly statistics with default months', async () => {
      const monthlyStats = [
        { date: '2024-01', total: 500, count: 20 },
        { date: '2023-12', total: 600, count: 25 },
      ];
      mockStatisticsService.getMonthlyStatistics.mockResolvedValue(monthlyStats);

      const result = await controller.getMonthlyStatistics(userId, undefined);

      expect(result).toEqual(monthlyStats);
      expect(mockStatisticsService.getMonthlyStatistics).toHaveBeenCalledWith(
        userId,
        undefined,
      );
    });

    it('should return monthly statistics with custom months', async () => {
      mockStatisticsService.getMonthlyStatistics.mockResolvedValue([]);

      await controller.getMonthlyStatistics(userId, 12);

      expect(mockStatisticsService.getMonthlyStatistics).toHaveBeenCalledWith(
        userId,
        12,
      );
    });
  });

  describe('getCategoryStatistics', () => {
    it('should return category statistics without date range', async () => {
      const categoryStats = [
        {
          category: { id: 'cat-1', name: 'Food', icon: '🍔', color: '#FF6B6B' },
          total: 300,
          count: 15,
          percentage: 50,
        },
        {
          category: { id: 'cat-2', name: 'Transport', icon: '🚗', color: '#4ECDC4' },
          total: 200,
          count: 10,
          percentage: 33.33,
        },
      ];
      mockStatisticsService.getCategoryStatistics.mockResolvedValue(categoryStats);

      const result = await controller.getCategoryStatistics(
        userId,
        undefined,
        undefined,
      );

      expect(result).toEqual(categoryStats);
      expect(mockStatisticsService.getCategoryStatistics).toHaveBeenCalledWith(
        userId,
        undefined,
        undefined,
      );
    });

    it('should return category statistics with date range', async () => {
      mockStatisticsService.getCategoryStatistics.mockResolvedValue([]);

      await controller.getCategoryStatistics(
        userId,
        '2024-01-01',
        '2024-01-31',
      );

      expect(mockStatisticsService.getCategoryStatistics).toHaveBeenCalledWith(
        userId,
        '2024-01-01',
        '2024-01-31',
      );
    });
  });
});
