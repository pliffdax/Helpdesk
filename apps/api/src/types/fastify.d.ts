import "fastify";
import { Role } from "@prisma/client";

declare module "fastify" {
  interface FastifyRequest {
    authUser?: {
      id: number;
      role: Role;
      email: string;
      name: string;
    };
  }
}
