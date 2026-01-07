import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const userId = 'user-id-123';

  const mockUser = {
    id: userId,
    username: 'testuser',
    email: 'test@example.com',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUsersService = {
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    deleteAccount: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: mockUsersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      mockUsersService.getProfile.mockResolvedValue(mockUser);

      const result = await controller.getProfile(userId);

      expect(result).toEqual(mockUser);
      expect(mockUsersService.getProfile).toHaveBeenCalledWith(userId);
    });
  });

  describe('updateProfile', () => {
    const updateDto = {
      username: 'newusername',
      email: 'newemail@example.com',
    };

    it('should update user profile', async () => {
      const updatedUser = { ...mockUser, ...updateDto };
      mockUsersService.updateProfile.mockResolvedValue(updatedUser);

      const result = await controller.updateProfile(userId, updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockUsersService.updateProfile).toHaveBeenCalledWith(
        userId,
        updateDto,
      );
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      currentPassword: 'oldPassword123',
      newPassword: 'newPassword456',
    };

    it('should change user password', async () => {
      const response = { message: 'Password changed successfully' };
      mockUsersService.changePassword.mockResolvedValue(response);

      const result = await controller.changePassword(userId, changePasswordDto);

      expect(result).toEqual(response);
      expect(mockUsersService.changePassword).toHaveBeenCalledWith(
        userId,
        changePasswordDto,
      );
    });
  });

  describe('deleteAccount', () => {
    const deleteAccountDto = {
      password: 'correctPassword123',
    };

    it('should delete user account', async () => {
      const response = { message: 'Account deleted successfully' };
      mockUsersService.deleteAccount.mockResolvedValue(response);

      const result = await controller.deleteAccount(userId, deleteAccountDto);

      expect(result).toEqual(response);
      expect(mockUsersService.deleteAccount).toHaveBeenCalledWith(
        userId,
        deleteAccountDto.password,
      );
    });
  });
});
