import { SendMailDto } from '@app/contracts/mail';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, SendMailOptions, Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor(
    private readonly congfigService: ConfigService
  ) {
    this.transporter = createTransport({
      host: this.congfigService.get('MAIL_HOST'),
      port: this.congfigService.get('MAIL_PORT'),
      secure: false,
      auth: {
        user: this.congfigService.get('MAIL_USER'),
        pass: this.congfigService.get('MAIL_PASSWORD'),
      },
    });
  }

  async sendMail(data: SendMailDto): Promise<{ success: boolean }> | null {
    const { sender, recipients, subject, html, text } = data;

    const mailOptions: SendMailOptions = {
      from: sender ?? {
        name: this.congfigService.get('MAIL_SENDER_NAME_DEFAULT'),
        address: this.congfigService.get('MAIL_SENDER_DEFAULT'),
      },
      to: recipients.map(r => r.address),
      subject,
      html,
      text,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true };
    } catch (error) {
      console.error('Error sending mail:', error);
      throw error;
    }
  }
}
