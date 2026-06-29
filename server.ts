import express from "express";
import { tenantResolverMiddleware } from "./src/middlewares/tenantResolver";
import { proxyToApp } from "./src/middlewares/proxy";

const app = express();
const port = Number(process.env.PORT) || 4000;

app.get("/healthz", (_req, res) => res.status(200).send("ok"));

app.use(tenantResolverMiddleware, proxyToApp);

app.listen(port, "0.0.0.0", () => {
  console.log(`Gateway running on port ${port}`);
});
