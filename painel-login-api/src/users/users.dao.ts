import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import type { Knex } from 'knex';

@Injectable()
export class UsersDao {
  constructor(
    @InjectConnection() private readonly knex: Knex,
  ) {}

  async findByEmail(email: string): Promise<Record<string, any> | undefined> {
    return this.knex('users')
      .whereRaw('LOWER(email) = LOWER(?)', [email])
      .first();
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<Record<string, any>> {
    const [id] = await this.knex('users').insert(data);

    return {
      id,
      ...data,
    };
  }

  async findAll(): Promise<Array<{id: number, name: string, email:string}>> {
    return this.knex('users')
    .select('id', 'name', 'email')
    .orderBy('id', 'asc')
  }
    
}
