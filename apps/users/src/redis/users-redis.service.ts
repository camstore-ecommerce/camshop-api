import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class UsersRedisService {
    constructor(
        @InjectRedis() private readonly redis: Redis,
    ) { }

    async get(key: string): Promise<string | null> {
        return await this.redis.get(key);
    }

    async ttl(key: string): Promise<number> {
        return await this.redis.ttl(key);
    }

    async set(key: string, value: string, ttl: number): Promise<void> {
        await this.redis.set(key, value, 'EX', ttl);
    }

    async increment(key: string): Promise<number> {
        return await this.redis.incr(key);
    }

    async delete(key: string): Promise<void> {
        await this.redis.del(key);
    }

    async expire(key: string, ttl: number): Promise<void> {
        await this.redis.expire(key, ttl);
    }
}
