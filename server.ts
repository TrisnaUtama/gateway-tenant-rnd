// src/server.ts
import express from "express";
import { tenantResolverMiddleware } from "./src/middlewares/tenantResolver";

const app = express();
const port = Number(process.env.PORT) || 8082;
if (!process.env.APP_INTERNAL_ORIGIN) {
  console.error("FATAL: APP_INTERNAL_ORIGIN env var is not set");
  process.exit(1);
}

app.get("/healthz", (_req, res) => res.status(200).send("ok"));

app.get("/internal/resolve", tenantResolverMiddleware, (req, res) => {
  res.set(
    "X-Upstream-Target",
    req.tenant!.targetOrigin ?? process.env.APP_INTERNAL_ORIGIN!,
  );
  res.set("X-Tenant-Company-Id", req.tenant!.companyId);
  res.set("X-Tenant-Domain-Id", req.tenant!.domainId);
  res.status(200).send();
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Gateway (resolver-only) running on port ${port}`);
});
