"use client";

import ApiList from "./api-list";
import AddApiKey from "./add-api-key";
import Smtp from "./smtp";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@unsend/ui/src/tabs";
import { useState } from 'react';

export default function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState("apiKeys");
  const disableSmtp = true;
  const handleTabChange = (value: any) => {
    if (value === "smtp" && disableSmtp) {
      return;
    }
    setActiveTab(value);
  };

  return (
    <div>
      <Tabs defaultValue="apiKeys" value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="apiKeys">API keys</TabsTrigger>
          <TabsTrigger
            value="smtp"
            className={`cursor-pointer ${disableSmtp ? 'opacity-50 pointer-events-none' : ''}`}
          >
            SMTP
          </TabsTrigger>
        </TabsList>
        <TabsContent value="apiKeys">      
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-lg">API Keys</h1>
            <AddApiKey />
          </div>
          <ApiList />
        </TabsContent>
        <TabsContent value="smtp">
          <Smtp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
