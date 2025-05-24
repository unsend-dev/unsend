export type EmailContent = {
  to: string | string[];
  from: string;
  subject?: string;
  templateId?: string;
  variables?: Record<string, string>;
  text?: string;
  html?: string;
  replyTo?: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<EmailAttachment>;
  unsubUrl?: string;
  scheduledAt?: string;
  inReplyTo?: string;
};

export type EmailAttachment = {
  filename: string;
  content: string;
};
