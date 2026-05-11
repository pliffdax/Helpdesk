import { mkdirSync } from "node:fs";
import path from "node:path";
import winston from "winston";

const logDir = path.resolve(process.cwd(), "apps/api/logs");

mkdirSync(logDir, { recursive: true });

export const appLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
    }),
  ],
});

export function logRequestDuration(params: {
  method: string;
  url: string;
  statusCode: number;
  durationMs: number;
}) {
  appLogger.info("request completed", params);
}
