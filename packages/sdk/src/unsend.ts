import { ErrorResponse } from "../types";
import { Emails } from "./email";

const defaultBaseUrl = "https://app.unsend.dev";
// eslint-disable-next-line turbo/no-undeclared-env-vars
const baseUrl = `${process?.env?.UNSEND_BASE_URL ?? defaultBaseUrl}/api/v1`;

function isUNSENDErrorResponse(error: { error: ErrorResponse }) {
  return error.error.code !== undefined;
}

export class Unsend {
  private readonly headers: Headers;

  // readonly domains = new Domains(this);
  readonly emails = new Emails(this);

  constructor(readonly key?: string) {
    if (!key) {
      if (typeof process !== "undefined" && process.env) {
        this.key = process.env.UNSEND_API_KEY;
      }

      if (!this.key) {
        throw new Error(
          'Missing API key. Pass it to the constructor `new Unsend("re_123")`'
        );
      }
    }

    this.headers = new Headers({
      Authorization: `Bearer ${this.key}`,
      "Content-Type": "application/json",
    });
  }

  async fetchRequest<T>(
    path: string,
    options = {}
  ): Promise<{ data: T | null; error: ErrorResponse | null }> {
    const response = await fetch(`${baseUrl}${path}`, options);
    const defaultError = {
      code: "INTERNAL_SERVER_ERROR",
      message: response.statusText,
    };

    if (!response.ok) {
      try {
        const resp = await response.json();
        if (isUNSENDErrorResponse(resp)) {
          return { data: null, error: resp };
        }

        return { data: null, error: resp.error };
      } catch (err) {
        if (err instanceof Error) {
          return {
            data: null,
            error: defaultError,
          };
        }

        return { data: null, error: defaultError };
      }
    }

    const data = await response.json();
    return { data, error: null };
  }

  async post<T>(path: string, body: unknown) {
    const requestOptions = {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async get<T>(path: string) {
    const requestOptions = {
      method: "GET",
      headers: this.headers,
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async put<T>(path: string, body: any) {
    const requestOptions = {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async patch<T>(path: string, body: any) {
    const requestOptions = {
      method: "PATCH",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }

  async delete<T>(path: string, body?: unknown) {
    const requestOptions = {
      method: "DELETE",
      headers: this.headers,
      body: JSON.stringify(body),
    };

    return this.fetchRequest<T>(path, requestOptions);
  }
}
