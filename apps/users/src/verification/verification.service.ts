import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';
import { Cron } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class VerificationService {
	constructor(
		private readonly prismaService: PrismaService,
		private readonly configService: ConfigService,
	) {}

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

	async generateOtpCode(userId: string, size: number = 6): Promise<string> {
		const now = new Date();

		// Check if a token was requested too recently
		// Feel free to implement robust throthling/security
		const recentToken = await this.prismaService.verification.findFirst({
			where: {
				userId,
				created_at: {
					gt: new Date(
						now.getTime() - this.minRequestIntervalMinutes * 60 * 1000,
					),
				},
			},
		});

		if (recentToken) {
			throw new UnprocessableEntityException(
				'Please wait a minute before requesting a new token.',
			);
		}

		const otp = this.generateOtp(size);
		const hashedToken = await bcrypt.hash(otp, this.saltRounds);

		await this.prismaService.verification.deleteMany({ where: { userId } });

		await this.prismaService.verification.create({
			data: {
				userId,
				token: hashedToken,
				expires_at: new Date(
					now.getTime() + this.tokenExpirationMinutes * 60 * 1000,
				),
			},
		});

		return otp;
	}

	async validateOtp(userId: string, token: string): Promise<boolean> {
		const validToken = await this.prismaService.verification.findFirst({
			where: {
				userId,
				expires_at: { gt: new Date() },
			},
		});

		if (validToken && (await bcrypt.compare(token, validToken.token))) {
			await this.prismaService.verification.delete({
				where: { id: validToken.id },
			});
			return true;
		} else {
			return false;
		}
	}

	private async cleanUpExpiredTokens(): Promise<void> {
		const now = new Date();
		await this.prismaService.verification.deleteMany({
			where: {
				expires_at: { lt: now },
			},
		});
	}

	@Cron('0 0 * * *') // This cron expression runs the task every day at midnight
	async handleCron() {
		await this.cleanUpExpiredTokens();
	}
}
