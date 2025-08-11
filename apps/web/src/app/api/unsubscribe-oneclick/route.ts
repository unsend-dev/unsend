import { NextRequest, NextResponse } from "next/server";
import { unsubscribeContactFromLink } from "~/server/service/campaign-service";
import { logger } from "~/server/logger/log";

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to check for List-Unsubscribe=One-Click
    const formData = await request.formData();
    const listUnsubscribe = formData.get("List-Unsubscribe");

    // Verify this is a one-click unsubscribe request
    if (listUnsubscribe !== "One-Click") {
      return NextResponse.json(
        { error: "Invalid unsubscribe request" },
        { status: 400 }
      );
    }

    // Extract id and hash from URL search parameters
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const hash = url.searchParams.get("hash");

    if (!id || !hash) {
      logger.warn(
        { id, hash, url: request.url },
        "One-click unsubscribe: Missing id or hash"
      );
      return NextResponse.json(
        { error: "Invalid unsubscribe link" },
        { status: 400 }
      );
    }

    // Process the unsubscribe using existing logic
    const contact = await unsubscribeContactFromLink(id, hash);

    logger.info(
      { contactId: contact.id, campaignId: id.split("-")[1] },
      "One-click unsubscribe successful"
    );

    // Return success response for email clients
    return NextResponse.json(
      { 
        success: true, 
        message: "Successfully unsubscribed",
        contact: contact.email 
      },
      { status: 200 }
    );
  } catch (error) {
    logger.error(
      { error: error instanceof Error ? error.message : error },
      "One-click unsubscribe failed"
    );

    // Return error response
    return NextResponse.json(
      { error: "Failed to process unsubscribe request" },
      { status: 500 }
    );
  }
}