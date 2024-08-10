"use client";

import { Editor } from "@unsend/email-editor";
import { Button } from "@unsend/ui/src/button";
import { useState } from "react";

export default function EditorPage() {
  const [json, setJson] = useState<Record<string, any>>({
    type: "doc",
    content: [],
  });

  const onConvertToHtml = async () => {
    console.log(json)
    const resp = await fetch("http://localhost:3000/api/to-html", {
      method: "POST",
      body: JSON.stringify(json),
    });

    const respJson = await resp.json();
    console.log(respJson);
  };

  return (
    <div className=" max-w-2xl mx-auto">
      <h1 className="text-center text-2xl py-8">
        Try out unsend's email editor
      </h1>
      <div className="flex flex-col gap-4">
        <Button className="w-[200px]" onClick={onConvertToHtml}>
          Convert to HTML
        </Button>

        <Editor onUpdate={(editor) => setJson(editor.getJSON())} />
      </div>
    </div>
  );
}
