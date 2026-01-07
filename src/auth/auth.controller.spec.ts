import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthResponse = {
    user: {
      id: 'user-id-123',
      email: 'test@example.com',
      username: 'testuser',
    },
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
    refresh: jest.fn(),
    logout: jest.fn(),
    getProfile: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      username: 'newuser',
      email: 'new@example.com',
      password: 'Password123!',
    };

    it('should register a new user', async () => {
      mockAuthService.register.mockResolvedValue(mockAuthResponse);

      const result = await controller.register(registerDto);

      expect(result).toEqual(mockAuthResponse);
      expect(mockAuthService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    const loginDto = {
      emailOrUsername: 'test@example.com',
      password: 'Password123!',
    };

    it('should login a user', async () => {
      mockAuthService.login.mockResolvedValue(mockAuthResponse);

      const result = await controller.login(loginDto);

      expect(result).toEqual(mockAuthResponse);
      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
    });
  });

  describe('refresh', () => {
    it('should refresh tokens', async () => {
      const tokenResponse = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      };
      mockAuthService.refresh.mockResolvedValue(tokenResponse);

      const result = await controller.refresh('user-id-123', {
        refreshToken: 'old-refresh-token',
      });

      expect(result).toEqual(tokenResponse);
      expect(mockAuthService.refresh).toHaveBeenCalledWith(
        'user-id-123',
        'old-refresh-token',
      );
    });
  });

  describe('logout', () => {
    it('should logout user with refresh token', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout('user-id-123', {
        refreshToken: 'refresh-token',
      });

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        'user-id-123',
        'refresh-token',
      );
    });

    it('should logout user without refresh token', async () => {
      mockAuthService.logout.mockResolvedValue(undefined);

      const result = await controller.logout('user-id-123', undefined);

      expect(result).toEqual({ message: 'Logged out successfully' });
      expect(mockAuthService.logout).toHaveBeenCalledWith(
        'user-id-123',
        undefined,
      );
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      const profile = {
        id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockAuthService.getProfile.mockResolvedValue(profile);

      const result = await controller.getProfile('user-id-123');

      expect(result).toEqual(profile);
      expect(mockAuthService.getProfile).toHaveBeenCalledWith('user-id-123');
    });
  });
});
