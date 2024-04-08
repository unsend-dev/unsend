import { swaggerUI } from "@hono/swagger-ui";

import { getApp } from "./hono";
import getDomains from "./get_domains";

export const app = getApp();

getDomains(app);

// The OpenAPI documentation will be available at /doc
app.doc("/doc", {
  openapi: "3.0.0",
  info: {
    version: "1.0.0",
    title: "My API",
  },
  servers: [{ url: "/api/v1" }],
});

app.get("/ui", swaggerUI({ url: "/api/v1/doc" }));

export default app;
