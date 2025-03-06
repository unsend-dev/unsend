"use client";

import TemplateList from "./template-list";
import CreateTemplate from "./create-template";

export default function TemplatesPage() {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-lg">Templates</h1>
        <CreateTemplate />
      </div>
      <TemplateList />
    </div>
  );
}
