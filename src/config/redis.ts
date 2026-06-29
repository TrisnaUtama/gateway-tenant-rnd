import Redis from "ioredis";

export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
});

redis.on("error", (err) => console.error("[Redis] connection error:", err));
redis.on("connect", () => console.log("[Redis] connected"));
