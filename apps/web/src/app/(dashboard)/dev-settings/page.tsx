"use client";

import AddApiKey from "./api-keys/add-api-key";
import ApiList from "./api-keys/api-list";

export default function ApiKeysPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-medium">API Keys</h2>
        <AddApiKey />
      </div>
      <ApiList />
    </div>
  );
}
