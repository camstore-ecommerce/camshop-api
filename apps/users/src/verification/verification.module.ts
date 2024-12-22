import { Module } from '@nestjs/common';
import { VerificationService } from './verification.service';
import { PrismaService } from '../prisma.service';
import { UsersRedisService } from '../redis/users-redis.service';

@Module({
	providers: [VerificationService, PrismaService, UsersRedisService],
	exports: [VerificationService],
})
export class VerificationModule {}
