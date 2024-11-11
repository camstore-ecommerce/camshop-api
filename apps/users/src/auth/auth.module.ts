import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { VerificationModule } from '../verification/verification.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAIL_CLIENT } from '@app/common/constants/services';

@Module({
	imports: [
		UsersModule,
		VerificationModule,
		JwtModule.registerAsync({
			useFactory: (configService: ConfigService) => ({
				secret: configService.get('JWT_SECRET'),
				signOptions: { expiresIn: `${configService.get('JWT_EXPIRATION')}s` },
			}),
			inject: [ConfigService],
		}),
		ClientsModule.register([
			{
				name: MAIL_CLIENT,
				transport: Transport.RMQ,
				options: {
					urls: [process.env.RMQ_URL || 'amqp://localhost:5672'],
					queue: 'mail_queue',
					queueOptions: {
						durable: false,
					},
				},
			},
		]),
	],
	controllers: [AuthController],
	providers: [AuthService, JwtStrategy, JwtAuthGuard],
})
export class AuthModule {}
