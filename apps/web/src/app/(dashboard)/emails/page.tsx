"use client";

import dynamic from "next/dynamic";
import EmailList from "./email-list";

export default function EmailsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Emails</h1>
      </div>
      <EmailList />
    </div>
  );
}
