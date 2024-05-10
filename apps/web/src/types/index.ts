export type EmailContent = {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: Array<EmailAttachment>;
};

export type EmailAttachment = {
  filename: string;
  content: string;
};
