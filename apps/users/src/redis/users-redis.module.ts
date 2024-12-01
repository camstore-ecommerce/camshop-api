import { Module } from '@nestjs/common';
import { UsersRedisService } from './users-redis.service';
import { RedisModule } from '@nestjs-modules/ioredis';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        type: 'single',
        url: `redis://${process.env.REDIS_HOST || '0.0.0.0'}:6379`,
      }),
    }),
  ],
  providers: [UsersRedisService],
  exports: [UsersRedisService],
})
export class UsersRedisModule { }
