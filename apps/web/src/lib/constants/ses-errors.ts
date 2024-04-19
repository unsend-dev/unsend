export const DELIVERY_DELAY_ERRORS = {
  InternalFailure: "An internal Unsend issue caused the message to be delayed.",
  General: "A generic failure occurred during the SMTP conversation.",
  MailboxFull:
    "The recipient's mailbox is full and is unable to receive additional messages.",
  SpamDetected:
    "The recipient's mail server has detected a large amount of unsolicited email from your account.",
  RecipientServerError:
    "A temporary issue with the recipient's email server is preventing the delivery of the message.",
  IPFailure:
    "The IP address that's sending the message is being blocked or throttled by the recipient's email provider.",
  TransientCommunicationFailure:
    "There was a temporary communication failure during the SMTP conversation with the recipient's email provider.",
  BYOIPHostNameLookupUnavailable:
    "Unsend was unable to look up the DNS hostname for your IP addresses. This type of delay only occurs when you use Bring Your Own IP.",
  Undetermined:
    "Unsend wasn't able to determine the reason for the delivery delay.",
  SendingDeferral:
    "Unsend has deemed it appropriate to internally defer the message.",
};

export const BOUNCE_ERROR_MESSAGES = {
  Undetermined: "Unsend was unable to determine a specific bounce reason.",
  Permanent: {
    General:
      "Unsend received a general hard bounce. If you receive this type of bounce, you should remove the recipient's email address from your mailing list.",
    NoEmail:
      "Unsend received a permanent hard bounce because the target email address does not exist. If you receive this type of bounce, you should remove the recipient's email address from your mailing list.",
    Suppressed:
      "Unsend has suppressed sending to this address because it has a recent history of bouncing as an invalid address. To override the global suppression list, see Using the Unsend account-level suppression list.",
    OnAccountSuppressionList:
      "Unsend has suppressed sending to this address because it is on the account-level suppression list. This does not count toward your bounce rate metric.",
  },
  Transient: {
    General:
      "Unsend received a general bounce. You may be able to successfully send to this recipient in the future.",
    MailboxFull:
      "Unsend received a mailbox full bounce. You may be able to successfully send to this recipient in the future.",
    MessageTooLarge:
      "Unsend received a message too large bounce. You may be able to successfully send to this recipient if you reduce the size of the message.",
    ContentRejected:
      "Unsend received a content rejected bounce. You may be able to successfully send to this recipient if you change the content of the message.",
    AttachmentRejected:
      "Unsend received an attachment rejected bounce. You may be able to successfully send to this recipient if you remove or change the attachment.",
  },
};
