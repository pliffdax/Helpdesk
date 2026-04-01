export type TicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED" | "CLOSED";
export type TicketPriority = "LOW" | "MEDIUM" | "HIGH";
export type UserRole = "USER" | "AGENT" | "ADMIN";

export type Category = {
  id: number;
  name: string;
  ticketsCount?: number;
  createdAt?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};

export type Ticket = {
  id: number;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  categoryId: number;
  creator: Pick<User, "id" | "name" | "email" | "role">;
  category: Pick<Category, "id" | "name">;
};

const API_BASE_URL =
  process.env.HELPDESK_API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const MOCK_USERS: User[] = [
  { id: 1, name: "Ivan Petrenko", email: "ivan@example.com", role: "USER" },
  { id: 2, name: "Olena Moroz", email: "olena@example.com", role: "AGENT" },
  { id: 3, name: "Admin Helpdesk", email: "admin@example.com", role: "ADMIN" },
];

const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: "Auth", ticketsCount: 2 },
  { id: 2, name: "UI", ticketsCount: 1 },
  { id: 3, name: "Infrastructure", ticketsCount: 1 },
];

const MOCK_TICKETS: Ticket[] = [
  {
    id: 1,
    title: "Не вдається увійти в систему",
    description: "Після введення пароля форма входу повертає помилку 401.",
    status: "OPEN",
    priority: "HIGH",
    createdAt: "2026-03-30T09:00:00.000Z",
    updatedAt: "2026-03-30T09:00:00.000Z",
    creatorId: 1,
    categoryId: 1,
    creator: {
      id: 1,
      name: "Ivan Petrenko",
      email: "ivan@example.com",
      role: "USER"
    },
    category: {
      id: 1,
      name: "Auth"
    }
  },
  {
    id: 2,
    title: "Проблема з відображенням сторінки профілю",
    description: "На мобільному екрані блок з кнопками виходить за межі контейнера.",
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    createdAt: "2026-03-30T10:00:00.000Z",
    updatedAt: "2026-03-30T10:00:00.000Z",
    creatorId: 1,
    categoryId: 2,
    creator: {
      id: 1,
      name: "Ivan Petrenko",
      email: "ivan@example.com",
      role: "USER"
    },
    category: {
      id: 2,
      name: "UI"
    }
  },
  {
    id: 3,
    title: "Потрібно оновити конфігурацію сервера",
    description: "Після зміни змінних середовища сервіс не бачить нову конфігурацію.",
    status: "RESOLVED",
    priority: "LOW",
    createdAt: "2026-03-30T11:00:00.000Z",
    updatedAt: "2026-03-30T11:00:00.000Z",
    creatorId: 3,
    categoryId: 3,
    creator: {
      id: 3,
      name: "Admin Helpdesk",
      email: "admin@example.com",
      role: "ADMIN"
    },
    category: {
      id: 3,
      name: "Infrastructure"
    }
  }
];

async function readJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function getUsers() {
  const response = await readJson<{ data: User[] }>("/api/users");
  return response?.data ?? MOCK_USERS;
}

export async function getCategories() {
  const response = await readJson<{ data: Category[] }>("/api/categories");
  return response?.data ?? MOCK_CATEGORIES;
}

export async function getTickets(filters?: {
  search?: string;
  status?: string;
  priority?: string;
}) {
  const query = new URLSearchParams();

  if (filters?.search) query.set("search", filters.search);
  if (filters?.status) query.set("status", filters.status);
  if (filters?.priority) query.set("priority", filters.priority);

  const suffix = query.toString() ? `/api/tickets?${query.toString()}` : "/api/tickets";
  const response = await readJson<{ data: Ticket[] }>(suffix);

  if (response?.data) {
    return response.data;
  }

  return MOCK_TICKETS.filter((ticket) => {
    const bySearch =
      !filters?.search ||
      ticket.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      ticket.description.toLowerCase().includes(filters.search.toLowerCase());
    const byStatus = !filters?.status || ticket.status === filters.status;
    const byPriority = !filters?.priority || ticket.priority === filters.priority;
    return bySearch && byStatus && byPriority;
  });
}

export async function getTicketById(id: number) {
  const response = await readJson<{ data: Ticket }>(`/api/tickets/${id}`);
  return response?.data ?? MOCK_TICKETS.find((ticket) => ticket.id === id) ?? null;
}

export async function getDashboardStats() {
  const [tickets, categories, users] = await Promise.all([getTickets(), getCategories(), getUsers()]);

  return {
    tickets: tickets.length,
    openTickets: tickets.filter((ticket) => ticket.status === "OPEN").length,
    categories: categories.length,
    users: users.length
  };
}

export function getPublicApiBaseUrl() {
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";
}
