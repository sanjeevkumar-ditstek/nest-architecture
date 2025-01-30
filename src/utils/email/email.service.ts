import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as sendgrid from '@sendgrid/mail';
import { ConfigService } from '../../config/config.service';
// import { mjml2html } from 'mjml'; // Correct named import
import * as mjml2html from 'mjml'; // Correct named import

export enum EmailProvider {
  SMTP = 'smtp',
  SENDGRID = 'sendgrid',
}

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const provider = this.configService.get('EMAIL_PROVIDER');
    console.log('provider:', provider);

    if (provider === EmailProvider.SENDGRID) {
      sendgrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
    } else {
      this.transporter = nodemailer.createTransport({
        host: this.configService.get('SMTP_HOST'),
        port: this.configService.get('SMTP_PORT'),
        auth: {
          user: this.configService.get('SMTP_USER'),
          pass: this.configService.get('SMTP_PASS'),
        },
      });
    }
  }

  async sendEmail(
    to: string,
    subject: string,
    text: string,
    attachments?: any[],
  ) {
    const provider = this.configService.get('EMAIL_PROVIDER');
    const { html, errors } = mjml2html(
      `<mjml>
        <mj-body background-color="#f4f4f4">
          <mj-section background-color="#ffffff" padding="20px">
            <mj-column>
              <mj-text align="center" font-size="24px" font-family="Helvetica, Arial, sans-serif" color="#333333" font-weight="bold">
                Login to Your Account
              </mj-text>
              <mj-text align="center" font-size="16px" font-family="Helvetica, Arial, sans-serif" color="#555555">
                Hi, ${text}.
              </mj-text>
              <mj-button href="http://localhost:3000/user/send-email" background-color="#007BFF" color="#ffffff" font-family="Helvetica, Arial, sans-serif" font-size="16px" border-radius="5px" padding="10px 25px">
                Login Now
              </mj-button>
              <mj-text align="center" font-size="14px" font-family="Helvetica, Arial, sans-serif" color="#888888">
                If you didn't request this, please ignore this email.
              </mj-text>
            </mj-column>
          </mj-section>

          <mj-section background-color="#ffffff" padding="10px">
            <mj-column>
              <mj-text align="center" font-size="12px" font-family="Helvetica, Arial, sans-serif" color="#999999">
                &copy; 2024 Your Company. All rights reserved.
              </mj-text>
              <mj-text align="center" font-size="12px" font-family="Helvetica, Arial, sans-serif" color="#999999">
                1234 Street Name, City, State, 12345
              </mj-text>
              <mj-text align="center" font-size="12px" font-family="Helvetica, Arial, sans-serif" color="#999999">
                <a href="https://yourwebsite.com/unsubscribe" style="color: #999999; text-decoration: underline;">
                  Unsubscribe
                </a>
              </mj-text>
            </mj-column>
          </mj-section>
        </mj-body>
      </mjml>
      `,
      {},
    );

    // Check for errors in MJML conversion
    if (errors.length) {
      throw new Error(`MJML conversion error: ${errors}`);
    }

    if (provider === EmailProvider.SENDGRID) {
      return await sendgrid.send({
        to,
        from: this.configService.get('FROM_EMAIL'),
        subject,
        html, // Use the generated HTML
        attachments,
      });
    } else {
      return await this.transporter.sendMail({
        to,
        from: this.configService.get('FROM_EMAIL'),
        subject,
        html, // Use the generated HTML
        attachments,
      });
    }
  }
}
