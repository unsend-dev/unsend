import { Context } from "hono";
import { db } from "../db";
import { UnsendApiError } from "./api-error";

export const getContactBook = async (c: Context, teamId: number) => {
  const contactBookId = c.req.param("contactBookId");

  if (!contactBookId) {
    throw new UnsendApiError({
      code: "BAD_REQUEST",
      message: "contactBookId is mandatory",
    });
  }

  const contactBook = await db.contactBook.findUnique({
    where: { id: contactBookId, teamId },
  });

  if (!contactBook) {
    throw new UnsendApiError({
      code: "NOT_FOUND",
      message: "Contact book not found for this team",
    });
  }

  return contactBook;
};
