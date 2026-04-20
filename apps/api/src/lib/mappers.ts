import {
  Category,
  Priority,
  Role,
  Status,
  Ticket,
  User,
} from "@prisma/client";

export const statusValues: Status[] = [
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

export const priorityValues: Priority[] = ["LOW", "MEDIUM", "HIGH"];
export const roleValues: Role[] = ["USER", "AGENT", "ADMIN"];

export type TicketWithRelations = Ticket & {
  creator: Pick<User, "id" | "name" | "email" | "role">;
  category: Pick<Category, "id" | "name">;
};

export function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export function isEmail(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
  );
}

export function isRole(value: unknown): value is Role {
  return typeof value === "string" && roleValues.includes(value as Role);
}

export function isStrongPassword(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8;
}

export function isStatus(value: unknown): value is Status {
  return typeof value === "string" && statusValues.includes(value as Status);
}

export function isPriority(value: unknown): value is Priority {
  return typeof value === "string" && priorityValues.includes(value as Priority);
}

export function mapTicket(ticket: TicketWithRelations) {
  return {
    id: ticket.id,
    title: ticket.title,
    description: ticket.description,
    status: ticket.status,
    priority: ticket.priority,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    creatorId: ticket.creatorId,
    categoryId: ticket.categoryId,
    creator: ticket.creator,
    category: ticket.category,
  };
}
