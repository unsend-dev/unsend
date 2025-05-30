/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/v1/domains": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Retrieve the user */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
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
                            region: string;
                            /** @default false */
                            clickTracking: boolean;
                            /** @default false */
                            openTracking: boolean;
                            publicKey: string;
                            dkimStatus?: string | null;
                            spfDetails?: string | null;
                            createdAt: string;
                            updatedAt: string;
                            /** @default false */
                            dmarcAdded: boolean;
                            /** @default false */
                            isVerifying: boolean;
                            errorMessage?: string | null;
                            subdomain?: string | null;
                        }[];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        name: string;
                        region: string;
                    };
                };
            };
            responses: {
                /** @description Create a new domain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
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
                            region: string;
                            /** @default false */
                            clickTracking: boolean;
                            /** @default false */
                            openTracking: boolean;
                            publicKey: string;
                            dkimStatus?: string | null;
                            spfDetails?: string | null;
                            createdAt: string;
                            updatedAt: string;
                            /** @default false */
                            dmarcAdded: boolean;
                            /** @default false */
                            isVerifying: boolean;
                            errorMessage?: string | null;
                            subdomain?: string | null;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/domains/{id}/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    id: number | null;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Create a new domain */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            message: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/emails/{emailId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    emailId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Retrieve the email */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
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
                            emailEvents: {
                                emailId: string;
                                /** @enum {string} */
                                status: "SCHEDULED" | "QUEUED" | "SENT" | "DELIVERY_DELAYED" | "BOUNCED" | "REJECTED" | "RENDERING_FAILURE" | "DELIVERED" | "OPENED" | "CLICKED" | "COMPLAINED" | "FAILED" | "CANCELLED";
                                createdAt: string;
                                data?: unknown;
                            }[];
                        };
                    };
                };
            };
        };
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    emailId: string;
                };
                cookie?: never;
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
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            emailId?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
    "/v1/emails": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        to: string | string[];
                        /** Format: email */
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
                        text?: string | null;
                        html?: string | null;
                        attachments?: {
                            filename: string;
                            content: string;
                        }[];
                        /** Format: date-time */
                        scheduledAt?: string;
                        inReplyToId?: string | null;
                    };
                };
            };
            responses: {
                /** @description Retrieve the user */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            emailId?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/emails/batch": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path?: never;
                cookie?: never;
            };
            requestBody: {
                content: {
                    "application/json": {
                        to: string | string[];
                        /** Format: email */
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
                        text?: string | null;
                        html?: string | null;
                        attachments?: {
                            filename: string;
                            content: string;
                        }[];
                        /** Format: date-time */
                        scheduledAt?: string;
                        inReplyToId?: string | null;
                    }[];
                };
            };
            responses: {
                /** @description List of successfully created email IDs */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            data: {
                                emailId: string;
                            }[];
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/emails/{emailId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    emailId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Retrieve the user */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            emailId?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/contactBooks/{contactBookId}/contacts": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: {
                    emails?: string;
                    page?: number;
                    limit?: number;
                    ids?: string;
                };
                header?: never;
                path: {
                    contactBookId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Retrieve multiple contacts */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            id: string;
                            firstName?: string | null;
                            lastName?: string | null;
                            email: string;
                            /** @default true */
                            subscribed: boolean;
                            properties: {
                                [key: string]: string;
                            };
                            contactBookId: string;
                            createdAt: string;
                            updatedAt: string;
                        }[];
                    };
                };
            };
        };
        put?: never;
        post: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    contactBookId: string;
                };
                cookie?: never;
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
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            contactId?: string;
                        };
                    };
                };
            };
        };
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/v1/contactBooks/{contactBookId}/contacts/{contactId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    contactBookId: string;
                    contactId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Retrieve the contact */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            id: string;
                            firstName?: string | null;
                            lastName?: string | null;
                            email: string;
                            /** @default true */
                            subscribed: boolean;
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
                query?: never;
                header?: never;
                path: {
                    contactBookId: string;
                };
                cookie?: never;
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
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            contactId: string;
                        };
                    };
                };
            };
        };
        post?: never;
        delete: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    contactBookId: string;
                    contactId: string;
                };
                cookie?: never;
            };
            requestBody?: never;
            responses: {
                /** @description Contact deleted successfully */
                200: {
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            success: boolean;
                        };
                    };
                };
            };
        };
        options?: never;
        head?: never;
        patch: {
            parameters: {
                query?: never;
                header?: never;
                path: {
                    contactBookId: string;
                    contactId: string;
                };
                cookie?: never;
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
                    headers: {
                        [name: string]: unknown;
                    };
                    content: {
                        "application/json": {
                            contactId?: string;
                        };
                    };
                };
            };
        };
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: never;
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
