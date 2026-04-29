import "dotenv/config";

function required(name: string, fallback?: string) {
  const value = process.env[name] ?? fallback;
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function parseCorsOrigins(value?: string) {
  return (value ?? "http://localhost:3000,http://127.0.0.1:3000")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export const env = {
  port: Number(process.env.PORT ?? 3001),
  host: process.env.HOST ?? "0.0.0.0",
  databaseUrl: required("DATABASE_URL"),
  corsOrigin: parseCorsOrigins(process.env.CORS_ORIGIN),
  authTokenSecret: required("AUTH_TOKEN_SECRET", "helpdesk-lab3-secret"),
  authTokenTtlSeconds: Number(process.env.AUTH_TOKEN_TTL_SECONDS ?? 60 * 15),
  refreshTokenTtlSeconds: Number(process.env.REFRESH_TOKEN_TTL_SECONDS ?? 60 * 60 * 24 * 7),
};
