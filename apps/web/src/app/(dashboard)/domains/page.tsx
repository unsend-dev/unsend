"use client";

import DomainsList from "./domain-list";
import AddDomain from "./add-domain";

export default function DomainsPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Domains</h1>
        <AddDomain />
      </div>
      <DomainsList />
    </div>
  );
}
