import type { Metadata } from "next";
import EmailList from "./email-list";

export default async function EmailsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Emails</h1>
      </div>
      <EmailList />
    </div>
  );
}
