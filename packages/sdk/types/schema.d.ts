/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */


export interface paths {
  "/v1/domains": {
    get: {
      responses: {
        /** @description Retrieve the user */
        200: {
          content: {
            "application/json": ({
                /**
                 * @description The ID of the domain
                 * @example 1
                 */
                id: number;
                /**
                 * @description The name of the domain
                 * @example example.com
                 */
                name: string;
                /**
                 * @description The ID of the team
                 * @example 1
                 */
                teamId: number;
                /** @enum {string} */
                status: "NOT_STARTED" | "PENDING" | "SUCCESS" | "FAILED" | "TEMPORARY_FAILURE";
                /** @default us-east-1 */
                region?: string;
                /** @default false */
                clickTracking?: boolean;
                /** @default false */
                openTracking?: boolean;
                publicKey: string;
                dkimStatus?: string | null;
                spfDetails?: string | null;
                createdAt: string;
                updatedAt: string;
              })[];
          };
        };
      };
    };
  };
  "/v1/emails/{emailId}": {
    get: {
      parameters: {
        path: {
          emailId: string;
        };
      };
      responses: {
        /** @description Retrieve the email */
        200: {
          content: {
            "application/json": {
              id: string;
              teamId: number;
              to: string | string[];
              replyTo?: string | string[];
              cc?: string | string[];
              bcc?: string | string[];
              from: string;
              subject: string;
              html: string | null;
              text: string | null;
              createdAt: string;
              updatedAt: string;
              emailEvents: ({
                  emailId: string;
                  /** @enum {string} */
                  status: "SCHEDULED" | "QUEUED" | "SENT" | "DELIVERY_DELAYED" | "BOUNCED" | "REJECTED" | "RENDERING_FAILURE" | "DELIVERED" | "OPENED" | "CLICKED" | "COMPLAINED" | "FAILED" | "CANCELLED";
                  createdAt: string;
                  data?: unknown;
                })[];
            };
          };
        };
      };
    };
    patch: {
      parameters: {
        path: {
          emailId: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            /** Format: date-time */
            scheduledAt: string;
          };
        };
      };
      responses: {
        /** @description Retrieve the user */
        200: {
          content: {
            "application/json": {
              emailId?: string;
            };
          };
        };
      };
    };
  };
  "/v1/emails": {
    post: {
      requestBody: {
        content: {
          "application/json": {
            to: string | string[];
            from: string;
            /** @description Optional when templateId is provided */
            subject?: string;
            /** @description ID of a template from the dashboard */
            templateId?: string;
            variables?: {
              [key: string]: string;
            };
            replyTo?: string | string[];
            cc?: string | string[];
            bcc?: string | string[];
            text?: string;
            html?: string;
            attachments?: {
                filename: string;
                content: string;
              }[];
            /** Format: date-time */
            scheduledAt?: string;
          };
        };
      };
      responses: {
        /** @description Retrieve the user */
        200: {
          content: {
            "application/json": {
              emailId?: string;
            };
          };
        };
      };
    };
  };
  "/v1/emails/{emailId}/cancel": {
    post: {
      parameters: {
        path: {
          emailId: string;
        };
      };
      responses: {
        /** @description Retrieve the user */
        200: {
          content: {
            "application/json": {
              emailId?: string;
            };
          };
        };
      };
    };
  };
  "/v1/contactBooks/{contactBookId}/contacts": {
    get: {
      parameters: {
        query?: {
          emails?: string;
          page?: number;
          limit?: number;
          ids?: string;
        };
        path: {
          contactBookId: string;
        };
      };
      responses: {
        /** @description Retrieve multiple contacts */
        200: {
          content: {
            "application/json": ({
                id: string;
                firstName?: string | null;
                lastName?: string | null;
                email: string;
                /** @default true */
                subscribed?: boolean;
                properties: {
                  [key: string]: string;
                };
                contactBookId: string;
                createdAt: string;
                updatedAt: string;
              })[];
          };
        };
      };
    };
    post: {
      parameters: {
        path: {
          contactBookId: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            email: string;
            firstName?: string;
            lastName?: string;
            properties?: {
              [key: string]: string;
            };
            subscribed?: boolean;
          };
        };
      };
      responses: {
        /** @description Retrieve the user */
        200: {
          content: {
            "application/json": {
              contactId?: string;
            };
          };
        };
      };
    };
  };
  "/v1/contactBooks/{contactBookId}/contacts/{contactId}": {
    get: {
      parameters: {
        path: {
          contactBookId: string;
          contactId: string;
        };
      };
      responses: {
        /** @description Retrieve the contact */
        200: {
          content: {
            "application/json": {
              id: string;
              firstName?: string | null;
              lastName?: string | null;
              email: string;
              /** @default true */
              subscribed?: boolean;
              properties: {
                [key: string]: string;
              };
              contactBookId: string;
              createdAt: string;
              updatedAt: string;
            };
          };
        };
      };
    };
    put: {
      parameters: {
        path: {
          contactBookId: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            email: string;
            firstName?: string;
            lastName?: string;
            properties?: {
              [key: string]: string;
            };
            subscribed?: boolean;
          };
        };
      };
      responses: {
        /** @description Contact upserted successfully */
        200: {
          content: {
            "application/json": {
              contactId: string;
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        path: {
          contactBookId: string;
          contactId: string;
        };
      };
      responses: {
        /** @description Contact deleted successfully */
        200: {
          content: {
            "application/json": {
              success: boolean;
            };
          };
        };
      };
    };
    patch: {
      parameters: {
        path: {
          contactBookId: string;
          contactId: string;
        };
      };
      requestBody: {
        content: {
          "application/json": {
            firstName?: string;
            lastName?: string;
            properties?: {
              [key: string]: string;
            };
            subscribed?: boolean;
          };
        };
      };
      responses: {
        /** @description Retrieve the user */
        200: {
          content: {
            "application/json": {
              contactId?: string;
            };
          };
        };
      };
    };
  };
}

export type webhooks = Record<string, never>;

export interface components {
  schemas: {
  };
  responses: never;
  parameters: {
  };
  requestBodies: never;
  headers: never;
  pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;
