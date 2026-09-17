import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersDao } from '../users/users.dao';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersDao: UsersDao,
    private readonly jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<string> {
    const user = await this.usersDao.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return this.jwtService.sign(payload);
  }

  async register(
    name: string,
    email: string,
    password: string,
  ): Promise<{ id: number; name: string; email: string }> {
    const existingUser = await this.usersDao.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersDao.create({
      name,
      email,
      password: hashedPassword,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }

  async findAllUsers(){
    return this.usersDao.findAll();
  }
}
