import { db } from "../db";

export type ContactInput = {
  email: string;
  firstName?: string;
  lastName?: string;
  properties?: Record<string, string>;
  subscribed?: boolean;
};

export async function addOrUpdateContact(
  contactBookId: string,
  contact: ContactInput
) {
  const createdContact = await db.contact.upsert({
    where: {
      contactBookId_email: {
        contactBookId,
        email: contact.email,
      },
    },
    create: {
      contactBookId,
      email: contact.email,
      firstName: contact.firstName,
      lastName: contact.lastName,
      properties: contact.properties ?? {},
      subscribed: contact.subscribed,
    },
    update: {
      firstName: contact.firstName,
      lastName: contact.lastName,
      properties: contact.properties ?? {},
      subscribed: contact.subscribed,
    },
  });

  return createdContact;
}

export async function updateContact(
  contactId: string,
  contact: Partial<ContactInput>
) {
  return db.contact.update({
    where: {
      id: contactId,
    },
    data: contact,
  });
}

export async function deleteContact(contactId: string) {
  return db.contact.delete({
    where: {
      id: contactId,
    },
  });
}

export async function bulkAddContacts(
  contactBookId: string,
  contacts: Array<ContactInput>
) {
  const createdContacts = await Promise.all(
    contacts.map((contact) => addOrUpdateContact(contactBookId, contact))
  );

  return createdContacts;
}

export async function unsubscribeContact(contactId: string) {
  await db.contact.update({
    where: {
      id: contactId,
    },
    data: {
      subscribed: false,
    },
  });
}

export async function subscribeContact(contactId: string) {
  await db.contact.update({
    where: {
      id: contactId,
    },
    data: {
      subscribed: true,
    },
  });
}
