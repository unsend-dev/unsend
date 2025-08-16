import { NextRequest, NextResponse } from "next/server";
import { unsubscribeContactFromLink } from "~/server/service/campaign-service";
import { logger } from "~/server/logger/log";

export async function POST(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const hash = url.searchParams.get("hash");

    if (!id || !hash) {
      logger.warn(
        `One-click unsubscribe: Missing id or hash id: ${id} hash: ${hash} url: ${request.url}`
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
