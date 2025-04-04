import { paths } from "../types/schema";
import { ErrorResponse } from "../types";
import { Unsend } from "./unsend";

type CreateDomainPayload =
  paths["/v1/domains"]["post"]["requestBody"]["content"]["application/json"];

type CreateDomainResponse = {
  data: CreateDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type CreateDomainResponseSuccess =
  paths["/v1/domains"]["post"]["responses"]["200"]["content"]["application/json"];

type GetDomainsResponse = {
  data: GetDomainsResponseSuccess | null;
  error: ErrorResponse | null;
};

type GetDomainsResponseSuccess =
  paths["/v1/domains"]["get"]["responses"]["200"]["content"]["application/json"];

type VerifyDomainResponse = {
  data: VerifyDomainResponseSuccess | null;
  error: ErrorResponse | null;
};

type VerifyDomainResponseSuccess =
  paths["/v1/domains/{id}/verify"]["put"]["responses"]["200"]["content"]["application/json"];

export class Domains {
  constructor(private readonly unsend: Unsend) {
    this.unsend = unsend;
  }

  async list(): Promise<GetDomainsResponse> {
    const data = await this.unsend.get<GetDomainsResponseSuccess>("/domains");
    return data;
  }

  async create(payload: CreateDomainPayload): Promise<CreateDomainResponse> {
    const data = await this.unsend.post<CreateDomainResponseSuccess>(
      "/domains",
      payload
    );
    return data;
  }

  async verify(id: number): Promise<VerifyDomainResponse> {
    const data = await this.unsend.put<VerifyDomainResponseSuccess>(
      `/domains/${id}/verify`,
      {}
    );
    return data;
  }
}
