import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthService } from '../src/auth/auth.service';
import { MsAuthController } from '../src/auth/ms-auth.controller';

describe('AuthController (e2e)', () => {
  let app: INestApplication<App>;
  const authServiceMock = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [MsAuthController],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
        enableImplicitConversion: true,
      }),
    );
    await app.init();
  });

  afterEach(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  it('/auth/register (POST) should create a user', async () => {
    authServiceMock.register.mockResolvedValue({
      id: 1,
      name: 'Novo Usuário',
      email: 'novo@teste.com',
    });

    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: ' Novo Usuário ',
        email: 'novo@teste.com',
        password: 'secret123',
      })
      .expect(201);

    expect(authServiceMock.register).toHaveBeenCalledWith(
      'Novo Usuário',
      'novo@teste.com',
      'secret123',
    );

    expect(response.body).toEqual({
      success: true,
      user: {
        id: 1,
        name: 'Novo Usuário',
        email: 'novo@teste.com',
      },
    });
  });

  it('/auth/register (POST) should reject invalid payload', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: '',
        email: 'email-invalido',
        password: '123',
      })
      .expect(400);
  });
});
