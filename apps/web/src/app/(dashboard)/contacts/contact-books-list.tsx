"use client";

import { formatDistanceToNow } from "date-fns";
import { api } from "~/trpc/react";
import DeleteContactBook from "./delete-contact-book";
import Link from "next/link";
import EditContactBook from "./edit-contact-book";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ContactBooksList() {
  const contactBooksQuery = api.contacts.getContactBooks.useQuery();

  const router = useRouter();

  return (
    <div className="mt-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {contactBooksQuery.data?.map((contactBook) => (
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            whileTap={{ scale: 0.99 }}
            className="border rounded-xl shadow hover:shadow-lg"
          >
            <div className="flex flex-col">
              <Link href={`/contacts/${contactBook.id}`} key={contactBook.id}>
                <div className="flex justify-between items-center p-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div>{contactBook.emoji}</div>
                    <div className="font-semibold truncate whitespace-nowrap overflow-ellipsis w-[180px]">
                      {contactBook.name}
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="font-mono">
                      {contactBook._count.contacts}
                    </span>{" "}
                    contacts
                  </div>
                </div>
              </Link>

              <div className="flex justify-between items-center border-t  bg-muted/50">
                <div
                  className="text-muted-foreground text-xs cursor-pointer w-full py-3 pl-4"
                  onClick={() => router.push(`/contacts/${contactBook.id}`)}
                >
                  {formatDistanceToNow(contactBook.createdAt, {
                    addSuffix: true,
                  })}
                </div>
                <div className="flex gap-3 pr-4">
                  <EditContactBook contactBook={contactBook} />
                  <DeleteContactBook contactBook={contactBook} />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
