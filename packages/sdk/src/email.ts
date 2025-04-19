import { render } from "@react-email/render";
import * as React from "react";
import { Unsend } from "./unsend";
import { paths } from "../types/schema";
import { ErrorResponse } from "../types";

type SendEmailPayload =
  paths["/v1/emails"]["post"]["requestBody"]["content"]["application/json"] & {
    react?: React.ReactElement;
  };

type CreateEmailResponse = {
  data: CreateEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateEmailResponseSuccess =
  paths["/v1/emails"]["post"]["responses"]["200"]["content"]["application/json"];

type GetEmailResponseSuccess =
  paths["/v1/emails/{emailId}"]["get"]["responses"]["200"]["content"]["application/json"];

type GetEmailResponse = {
  data: GetEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpdateEmailPayload =
  paths["/v1/emails/{emailId}"]["patch"]["requestBody"]["content"]["application/json"] & {
    react?: React.ReactElement;
  };

type UpdateEmailResponse = {
  data: UpdateEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type UpdateEmailResponseSuccess =
  paths["/v1/emails/{emailId}"]["patch"]["responses"]["200"]["content"]["application/json"];

type CancelEmailResponse = {
  data: CancelEmailResponseSuccess | null;
  error: ErrorResponse | null;
};

type CancelEmailResponseSuccess =
  paths["/v1/emails/{emailId}/cancel"]["post"]["responses"]["200"]["content"]["application/json"];

export class Emails {
  constructor(private readonly unsend: Unsend) {
    this.unsend = unsend;
  }

  async send(payload: SendEmailPayload) {
    return this.create(payload);
  }

  async create(payload: SendEmailPayload): Promise<CreateEmailResponse> {
    if (payload.react) {
      payload.html = await render(payload.react as React.ReactElement);
      delete payload.react;
    }

    const data = await this.unsend.post<CreateEmailResponseSuccess>(
      "/emails",
      payload
    );

    return data;
  }

  async get(id: string): Promise<GetEmailResponse> {
    const data = await this.unsend.get<GetEmailResponseSuccess>(
      `/emails/${id}`
    );
    return data;
  }

  async update(
    id: string,
    payload: UpdateEmailPayload
  ): Promise<UpdateEmailResponse> {
    const data = await this.unsend.patch<UpdateEmailResponseSuccess>(
      `/emails/${id}`,
      payload
    );
    return data;
  }

  async cancel(id: string): Promise<CancelEmailResponse> {
    const data = await this.unsend.post<CancelEmailResponseSuccess>(
      `/emails/${id}/cancel`,
      {}
    );
    return data;
  }
}
