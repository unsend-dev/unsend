"use client";
import * as React from "react";
import { Code } from "@unsend/ui/src/code";
import { Button } from "@unsend/ui/src/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@unsend/ui/src/card";
import { TextWithCopyButton } from "@unsend/ui/src/text-with-copy";

export default function ExampleCard() {
  const smtpDetails = {
    smtp: "smtp.example.com",
    port: "587",
    user: "user@example.com",
    password: "supersecretpassword",
  };

  return (
    <Card className="mt-9 max-w-xl">
      <CardHeader>
        <CardTitle>SMTP</CardTitle>
        <CardDescription>
          Send emails using SMTP instead of the REST API. See documentation for
          more information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Host:</strong>
            <TextWithCopyButton
              className="ml-1 text-zinc-500 rounded-lg mt-1 p-2 w-full bg-gray-900"
              value={"smtp.unsend.dev"}
            ></TextWithCopyButton>
          </div>
          <div>
            <strong>Port:</strong>
            <TextWithCopyButton
              className="ml-1 text-zinc-500 rounded-lg mt-1 p-2 w-full bg-gray-900"
              value={"465"}
            ></TextWithCopyButton>
            <p className="ml-1 mt-1 text-zinc-500 ">
              For encrypted/TLS connections use <strong>2465</strong>,{" "}
              <strong>587</strong> or <strong>2587</strong>
            </p>
          </div>
          <div>
            <strong>User:</strong>
            <TextWithCopyButton
              className="ml-1 text-zinc-500 rounded-lg mt-1 p-2 w-full bg-gray-900"
              value={"unsend"}
            ></TextWithCopyButton>
          </div>
          <div>
            <strong>Password:</strong>
            <TextWithCopyButton
              className="ml-1 text-zinc-500 rounded-lg mt-1 p-2 w-full bg-gray-900"
              value={"YOUR_API_KEY"}
            ></TextWithCopyButton>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
