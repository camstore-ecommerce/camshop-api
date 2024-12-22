import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { UsersRedisService } from '../redis/users-redis.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class VerificationService {
	constructor(
		private readonly redisService: UsersRedisService,
	) { }

	// Minimum interval between requests
	// Feel free to implement robust throthling/security
	private readonly minRequestIntervalMinutes = 1;
	private readonly tokenExpirationMinutes = 15;
	private readonly saltRounds = 10;

	private generateOtp(size: number = 6): string {
		const max = Math.pow(10, size);
		const randomNumber = crypto.randomInt(0, max);
		return randomNumber.toString().padStart(size, '0');
	}

	async generateOtpCode(user_id: string, size: number = 6): Promise<string> {

		// Check if a token was requested too recently
		// Feel free to implement robust throthling/security
		const recentToken = await this.redisService.get(`otp:${user_id}`);

		if (recentToken) {
			throw new RpcException(
				'Please wait a minute before requesting a new token.',
			);
		}

		const otp = this.generateOtp(size);
		const hashedToken = await bcrypt.hash(otp, this.saltRounds);

		await this.redisService.set(`otp:${user_id}`, hashedToken, this.tokenExpirationMinutes * 60);

		return otp;
	}

	async validateOtp(user_id: string, token: string): Promise<boolean> {
		const hashedToken = await this.redisService.get(`otp:${user_id}`);

		if (hashedToken && (await bcrypt.compare(token, hashedToken))) {
			await this.redisService.delete(`otp:${user_id}`);
			return true;
		} else {
			return false;
		}
	}

}
