// src/middlewares/proxy.ts
import { createProxyMiddleware } from "http-proxy-middleware";
import type { Request } from "express";

export const proxyToApp = createProxyMiddleware({
  changeOrigin: true,
  ws: true,
  router: (req: Request) => {
    const target = req.tenant?.targetOrigin ?? process.env.ASSESSMENT_DOMAIN;
    return `https://${target}`;
  },
  on: {
    proxyReq: (proxyReq, req: any) => {
      if (req.tenant) {
        proxyReq.setHeader("X-Tenant-Company-Id", req.tenant.companyId);
        proxyReq.setHeader("X-Tenant-Domain-Id", req.tenant.domainId);
      }
    },
  },
});
