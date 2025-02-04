export interface ISendEmail {
  to: string;
  subject: string;
  text: string;
  attachments?: any[];
}
