import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { VerificationPurpose } from './entities/email-verification-challenge.entity';

describe('AuthService', () => {
  it('replaces a pending email and retires its active challenge in a transaction', async () => {
    const user = {
      id: 'user-1',
      email: 'old@example.com',
      pendingEmail: 'previous@example.com',
      isEmailVerified: true,
    };
    const userQuery = {
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(user),
    };
    const challengeQuery = {
      update: jest.fn().mockReturnThis(),
      set: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ affected: 1 }),
    };
    const userRepo = {
      createQueryBuilder: jest.fn(() => userQuery),
      save: jest.fn(async (entity: unknown) => entity),
    };
    const challengeRepo = {
      createQueryBuilder: jest.fn(() => challengeQuery),
      create: jest.fn((entity: unknown) => entity),
      save: jest.fn(async (entity: unknown) => entity),
    };
    const manager = {
      getRepository: jest.fn((entity: unknown) =>
        entity === User ? userRepo : challengeRepo,
      ),
    };
    const dataSource = {
      transaction: jest.fn(
        async (callback: (transactionManager: typeof manager) => Promise<unknown>) =>
          callback(manager),
      ),
    };
    const configService = { get: jest.fn(() => 'test-secret') };
    const emailQueue = { add: jest.fn().mockResolvedValue(undefined) };
    const service = new AuthService(
      configService as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      emailQueue as never,
      dataSource as never,
    );

    await service.issueChallenge(
      user.id,
      VerificationPurpose.EMAIL_CHANGE,
      ' New@Example.com ',
    );

    expect(dataSource.transaction).toHaveBeenCalledTimes(1);
    expect(user.pendingEmail).toBe('new@example.com');
    expect(userRepo.save).toHaveBeenCalledWith(user);
    expect(challengeQuery.where).toHaveBeenCalledWith(
      '"userId" = :userId',
      { userId: user.id },
    );
    expect(challengeQuery.andWhere).toHaveBeenNthCalledWith(
      1,
      '"purpose" = :purpose',
      { purpose: VerificationPurpose.EMAIL_CHANGE },
    );
    expect(challengeQuery.andWhere).toHaveBeenNthCalledWith(
      2,
      '"consumedAt" IS NULL',
    );
    expect(challengeQuery.set).toHaveBeenCalledWith(
      expect.objectContaining({ consumedAt: expect.any(Date) }),
    );
    expect(challengeRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: user.id,
        purpose: VerificationPurpose.EMAIL_CHANGE,
        targetEmail: 'new@example.com',
        consumedAt: null,
      }),
    );
    expect(emailQueue.add).toHaveBeenCalledWith(
      'verify-email',
      expect.objectContaining({ email: 'new@example.com' }),
      expect.any(Object),
    );
  });
});
