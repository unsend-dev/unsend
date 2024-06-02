"use client";

import ApiList from "./api-list";
import AddApiKey from "./add-api-key";

export default function ApiKeysPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">API Keys</h1>
        <AddApiKey />
      </div>
      <ApiList />
    </div>
  );
}
