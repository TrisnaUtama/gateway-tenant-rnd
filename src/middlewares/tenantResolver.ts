// src/middlewares/tenantResolver.ts
import type { Request, Response, NextFunction } from "express";
import { pool } from "../config/db";
import { redis } from "../config/redis";

const DOMAIN_CACHE_TTL = 60;
const QUERY = `
  SELECT id, company_id, hostname, type, target_origin
  FROM "Domain"
  WHERE hostname = $1 AND status = 'ACTIVE'
  LIMIT 1
`;

export async function tenantResolverMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const hostname = ((req.headers["x-original-host"] as string) ?? "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  const cacheKey = `domain:${hostname}`;

  try {
    const cached = await redis.get(cacheKey);
    let domain = cached ? JSON.parse(cached) : null;

    if (!domain) {
      const result = await pool.query(QUERY, [hostname]);
      domain = result.rows[0] ?? null;
      if (domain) {
        await redis.set(
          cacheKey,
          JSON.stringify(domain),
          "EX",
          DOMAIN_CACHE_TTL,
        );
      }
    }

    if (!domain) {
      return res
        .status(403)
        .json({ message: "Domain not registered or inactive" });
    }

    req.tenant = {
      companyId: domain.company_id,
      domainId: domain.id,
      type: domain.type,
      targetOrigin: domain.target_origin ?? null,
    };

    return next();
  } catch (error) {
    console.error("[tenantResolver] error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
