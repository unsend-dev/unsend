"use client";

import AddContactBook from "./add-contact-book";
import ContactBooksList from "./contact-books-list";

export default function ContactsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Contact books</h1>
        <AddContactBook />
      </div>
      <ContactBooksList />
    </div>
  );
}
