import { Controller } from '@nestjs/common';
import { MailService } from './mail.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MAIL_PATTERNS, SendMailDto } from '@app/contracts/mail';

@Controller()
export class MailController {
	constructor(private readonly mailService: MailService) {}

	@MessagePattern(MAIL_PATTERNS.SEND)
	async sendMail(@Payload() data: SendMailDto) {
		return await this.mailService.sendMail(data);
	}
}
