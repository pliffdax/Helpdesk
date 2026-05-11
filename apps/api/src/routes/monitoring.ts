import { createWriteStream, mkdirSync } from "node:fs";
import path from "node:path";
import { Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { randomUUID } from "node:crypto";
import { FastifyInstance, FastifyRequest } from "fastify";
import { appLogger } from "../lib/logger";

const uploadDir = path.resolve(process.cwd(), "apps/api/uploads");
const maxFileSizeBytes = 5 * 1024 * 1024;
const allowedMimeTypes = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

type SavedFile = {
  fieldname: string;
  originalName: string;
  filename: string;
  mimetype: string;
  size: number;
  path: string;
};

type MultipartFile = NonNullable<Awaited<ReturnType<FastifyRequest["file"]>>>;

class UploadValidationError extends Error {}

export async function monitoringRoutes(app: FastifyInstance) {
  app.get("/status", async () => {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    return {
      status: "ok",
      uptime: process.uptime(),
      memoryUsage,
      cpuUsage,
      timestamp: new Date().toISOString(),
    };
  });

  app.post("/upload", async (request, reply) => {
    const file = await request.file({
      limits: {
        fileSize: maxFileSizeBytes,
        files: 1,
      },
    });

    if (!file) {
      return reply.status(400).send({ message: "file is required" });
    }

    try {
      const savedFile = await saveMultipartFile(file);

      appLogger.info("file uploaded", {
        filename: savedFile.filename,
        mimetype: savedFile.mimetype,
        size: savedFile.size,
      });

      return reply.status(201).send({
        message: "file uploaded successfully",
        data: savedFile,
      });
    } catch (error) {
      if (error instanceof UploadValidationError) {
        return reply.status(400).send({ message: error.message });
      }

      throw error;
    }
  });

  app.post("/upload-multiple", async (request, reply) => {
    const savedFiles: SavedFile[] = [];

    try {
      for await (const file of request.files({
        limits: {
          fileSize: maxFileSizeBytes,
          files: 5,
        },
      })) {
        savedFiles.push(await saveMultipartFile(file));
      }
    } catch (error) {
      if (error instanceof UploadValidationError) {
        return reply.status(400).send({ message: error.message });
      }

      throw error;
    }

    if (!savedFiles.length) {
      return reply.status(400).send({ message: "at least one file is required" });
    }

    appLogger.info("multiple files uploaded", {
      count: savedFiles.length,
      files: savedFiles.map((file) => file.filename),
    });

    return reply.status(201).send({
      message: "files uploaded successfully",
      data: savedFiles,
    });
  });
}

async function saveMultipartFile(file: MultipartFile): Promise<SavedFile> {
  if (!allowedMimeTypes.has(file.mimetype)) {
    file.file.resume();
    throw new UploadValidationError("only jpg, png and pdf files are allowed");
  }

  mkdirSync(uploadDir, { recursive: true });

  const originalName = file.filename || "upload";
  const extension = path.extname(originalName).toLowerCase();
  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const absolutePath = path.join(uploadDir, filename);
  let size = 0;

  const sizeCounter = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      size += chunk.length;
      callback(null, chunk);
    },
  });

  await pipeline(file.file, sizeCounter, createWriteStream(absolutePath));

  return {
    fieldname: file.fieldname,
    originalName,
    filename,
    mimetype: file.mimetype,
    size,
    path: absolutePath,
  };
}
