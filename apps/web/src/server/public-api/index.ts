import { getApp } from "./hono";
import getDomains from "./api/domains/get-domains";
import sendEmail from "./api/emails/send-email";
import getEmail from "./api/emails/get-email";
import addContact from "./api/contacts/add-contact";
import updateContactInfo from "./api/contacts/update-contact";
import getContact from "./api/contacts/get-contact";
import updateEmailScheduledAt from "./api/emails/update-email";
import cancelScheduledEmail from "./api/emails/cancel-email";

export const app = getApp();

/**Domain related APIs */
getDomains(app);

/**Email related APIs */
getEmail(app);
sendEmail(app);
updateEmailScheduledAt(app);
cancelScheduledEmail(app);

/**Contact related APIs */
addContact(app);
updateContactInfo(app);
getContact(app);

export default app;
