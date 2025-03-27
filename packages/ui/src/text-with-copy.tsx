"use client";
import React from "react";
import { Button } from "./button";
import { CheckIcon, ClipboardCopy } from "lucide-react";

export const TextWithCopyButton: React.FC<{
    value: string;
    className?: string;
    alwaysShowCopy?: boolean;
}> = ({ value, className, alwaysShowCopy }) => {
    const [isCopied, setIsCopied] = React.useState(false);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(value);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000); // Reset isCopied to false after 2 seconds
        } catch (err) {
            console.error("Failed to copy: ", err);
        }
    };

    return (
        <div className={"flex gap-2 items-center group"}>
            <div className={className}>{value}</div>
            <Button
                variant="ghost"
                className={`hover:bg-transparent p-0 h-6 cursor-pointer text-muted-foreground ${
                    alwaysShowCopy ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                }`}
                onClick={copyToClipboard}
            >
                {isCopied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <ClipboardCopy className="h-4 w-4" />
                )}
            </Button>
        </div>
    );
};