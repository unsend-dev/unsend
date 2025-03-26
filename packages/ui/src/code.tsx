import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import ruby from "react-syntax-highlighter/dist/esm/languages/hljs/ruby";
import php from "react-syntax-highlighter/dist/esm/languages/hljs/php";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
// import { nightOwl } from "react-syntax-highlighter/dist/esm/styles/hljs";
import codeTheme from "../code-theme";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Button } from "./button";
import { ClipboardCopy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "../lib/utils";

export type Language = "js" | "ruby" | "php" | "python" | "curl";

export type CodeBlock = {
  language: Language;
  title?: string;
  code: string;
};

type CodeProps = {
  codeBlocks: CodeBlock[];
  codeClassName?: string;
};

SyntaxHighlighter.registerLanguage("js", js);
SyntaxHighlighter.registerLanguage("ruby", ruby);
SyntaxHighlighter.registerLanguage("php", php);
SyntaxHighlighter.registerLanguage("python", python);

export const Code: React.FC<CodeProps> = ({ codeBlocks, codeClassName }) => {
  const [selectedTab, setSelectedTab] = useState(
    codeBlocks[0]?.language ?? "js"
  );
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the icon back to clipboard after 2 seconds
    } catch (err) {
      alert("Failed to copy code");
    }
  };

  return (
    <div className="rounded-xl bg-background border shadow-[#1e293b] shadow-lg">
      <Tabs
        defaultValue={codeBlocks[0]?.language}
        onValueChange={(val) => setSelectedTab(val as Language)}
      >
        <div className="flex justify-between items-center border-b py-1 px-2">
          <TabsList className="w-full rounded-none justify-start bg-transparent h-12">
            <div className="">
              {codeBlocks.map((block) => (
                <TabsTrigger
                  key={block.language}
                  value={block.language}
                  className="data-[state=active]:bg-accent py-0.5 px-4 "
                >
                  {block.title || block.language}
                </TabsTrigger>
              ))}
            </div>
          </TabsList>
          <Button
            size="icon"
            variant="icon"
            onClick={() =>
              copyToClipboard(
                codeBlocks.find((block) => block.language === selectedTab)
                  ?.code || ""
              )
            }
          >
            {isCopied ? (
              <Check className="h-4 w-4" />
            ) : (
              <ClipboardCopy className="h-4 w-4" />
            )}
          </Button>
        </div>
        {codeBlocks.map((block) => (
          <TabsContent
            key={block.language}
            value={block.language}
            className="mt-0"
          >
            <div className={cn("overflow-auto rounded-b-xl", codeClassName)}>
              <SyntaxHighlighter language={block.language} style={codeTheme}>
                {block.code}
              </SyntaxHighlighter>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
