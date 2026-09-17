import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<
      Request & { user?: Record<string, any>; cookies?: Record<string, string> }
    >();

    const token = this.extractToken(req);

    if (!token) {
      throw new UnauthorizedException('Token não informado');
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }

  private extractToken(req: Request): string | undefined {
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.replace('Bearer ', '').trim();
    }

    const cookieToken = req.cookies?.session;

    if (cookieToken) {
      return cookieToken;
    }

    return undefined;
  }
}
