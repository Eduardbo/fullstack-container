import {
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersDao } from '../users/users.dao';

describe('AuthService', () => {
  let authService: AuthService;
  let usersDao: { findByEmail: jest.Mock; create: jest.Mock };
  let jwtService: { sign: jest.Mock };

  beforeEach(async () => {
    usersDao = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('signed-token'),
    };

    authService = new AuthService(
      usersDao as unknown as UsersDao,
      jwtService as unknown as JwtService,
    );
  });

  it('should sign a token when password is valid', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);
    usersDao.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@test.com',
      password: hashedPassword,
    });

    const token = await authService.login('user@test.com', 'secret123');

    expect(token).toBe('signed-token');
    expect(jwtService.sign).toHaveBeenCalledWith({
      sub: 1,
      email: 'user@test.com',
    });
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    const hashedPassword = await bcrypt.hash('secret123', 10);
    usersDao.findByEmail.mockResolvedValue({
      id: 1,
      email: 'user@test.com',
      password: hashedPassword,
    });

    await expect(authService.login('user@test.com', 'wrong-pass')).rejects.toThrow(
      UnauthorizedException,
    );
  });

  it('should register a new user with a hashed password', async () => {
    usersDao.findByEmail.mockResolvedValue(undefined);
    usersDao.create.mockResolvedValue({
      id: 2,
      name: 'Novo Usuário',
      email: 'novo@teste.com',
    });

    const user = await authService.register(
      'Novo Usuário',
      'novo@teste.com',
      'secret123',
    );

    expect(user).toMatchObject({
      name: 'Novo Usuário',
      email: 'novo@teste.com',
    });
    expect(usersDao.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Novo Usuário',
        email: 'novo@teste.com',
      }),
    );
    expect(usersDao.create.mock.calls[0][0].password).not.toBe('secret123');
  });

  it('should throw ConflictException when email already exists', async () => {
    usersDao.findByEmail.mockResolvedValue({
      id: 1,
      email: 'existente@teste.com',
    });

    await expect(
      authService.register('Existente', 'existente@teste.com', 'secret123'),
    ).rejects.toThrow(ConflictException);
  });
});
