import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  const userId = 'user-id-123';

  const mockCategory = {
    id: 'category-id-123',
    name: 'Food',
    icon: '🍔',
    color: '#FF6B6B',
    userId,
    isDefault: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCategoriesService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createDto = {
      name: 'Food',
      icon: '🍔',
      color: '#FF6B6B',
    };

    it('should create a category', async () => {
      mockCategoriesService.create.mockResolvedValue(mockCategory);

      const result = await controller.create(userId, createDto);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.create).toHaveBeenCalledWith(
        userId,
        createDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [mockCategory];
      mockCategoriesService.findAll.mockResolvedValue(categories);

      const result = await controller.findAll(userId);

      expect(result).toEqual(categories);
      expect(mockCategoriesService.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      mockCategoriesService.findOne.mockResolvedValue(mockCategory);

      const result = await controller.findOne(mockCategory.id, userId);

      expect(result).toEqual(mockCategory);
      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(
        mockCategory.id,
        userId,
      );
    });
  });

  describe('update', () => {
    const updateDto = {
      name: 'Updated Food',
      icon: '🍕',
    };

    it('should update a category', async () => {
      const updatedCategory = { ...mockCategory, ...updateDto };
      mockCategoriesService.update.mockResolvedValue(updatedCategory);

      const result = await controller.update(mockCategory.id, userId, updateDto);

      expect(result).toEqual(updatedCategory);
      expect(mockCategoriesService.update).toHaveBeenCalledWith(
        mockCategory.id,
        userId,
        updateDto,
      );
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const response = { message: 'Category deleted successfully' };
      mockCategoriesService.remove.mockResolvedValue(response);

      const result = await controller.remove(mockCategory.id, userId);

      expect(result).toEqual(response);
      expect(mockCategoriesService.remove).toHaveBeenCalledWith(
        mockCategory.id,
        userId,
      );
    });
  });
});
