import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshStrategy } from './jwt-refresh.strategy';
import { PrismaService } from '../../database/prisma.service';

describe('JwtRefreshStrategy', () => {
  let strategy: JwtRefreshStrategy;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    username: 'testuser',
    isActive: true,
  };

  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 7);

  const mockRefreshToken = {
    id: 'token-id-123',
    token: 'valid-refresh-token',
    userId: 'user-id-123',
    expiresAt: futureDate,
    user: mockUser,
  };

  const mockPrismaService = {
    refreshToken: {
      findUnique: jest.fn(),
    },
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'jwt.refreshSecret') return 'test-refresh-secret';
      return undefined;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtRefreshStrategy,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    strategy = module.get<JwtRefreshStrategy>(JwtRefreshStrategy);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    const payload = {
      sub: 'user-id-123',
      email: 'test@example.com',
      username: 'testuser',
    };

    it('should return user payload for valid refresh token', async () => {
      const req = { body: { refreshToken: 'valid-refresh-token' } };
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(
        mockRefreshToken,
      );

      const result = await strategy.validate(req, payload);

      expect(result).toEqual({
        sub: mockUser.id,
        email: mockUser.email,
        username: mockUser.username,
        refreshToken: 'valid-refresh-token',
      });
    });

    it('should throw UnauthorizedException if no refresh token in body', async () => {
      const req = { body: {} };

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token not found in database', async () => {
      const req = { body: { refreshToken: 'invalid-token' } };
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(null);

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if token is expired', async () => {
      const req = { body: { refreshToken: 'expired-token' } };
      const expiredToken = {
        ...mockRefreshToken,
        expiresAt: new Date('2020-01-01'),
      };
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(expiredToken);

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      const req = { body: { refreshToken: 'valid-token' } };
      const tokenWithInactiveUser = {
        ...mockRefreshToken,
        user: { ...mockUser, isActive: false },
      };
      mockPrismaService.refreshToken.findUnique.mockResolvedValue(
        tokenWithInactiveUser,
      );

      await expect(strategy.validate(req, payload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
