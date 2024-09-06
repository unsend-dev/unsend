"use client";

import EmailList from "./email-list";

export default function EmailsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold text-xl">Emails</h1>
      </div>
      <EmailList />
    </div>
  );
}
