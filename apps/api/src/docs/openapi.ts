type SchemaName =
  | "ErrorResponse"
  | "User"
  | "Category"
  | "Ticket"
  | "AuthResponse";

export const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Helpdesk API",
    version: "1.0.0",
    description:
      "REST API for the Helpdesk / Ticket System laboratory project. Includes authentication, users, categories, tickets, uploads, monitoring, caching, and pagination.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Local development API",
    },
  ],
  tags: [
    { name: "Health", description: "Service health checks" },
    { name: "Auth", description: "Registration, login, profile, and token refresh" },
    { name: "Users", description: "Helpdesk users" },
    { name: "Categories", description: "Ticket categories" },
    { name: "Tickets", description: "Helpdesk ticket CRUD and filters" },
    { name: "Monitoring", description: "Server status and uploads" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "validation error" },
        },
        required: ["message"],
      },
      User: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Olena Support" },
          email: { type: "string", example: "olena@example.com" },
          role: { type: "string", enum: ["USER", "AGENT", "ADMIN"], example: "USER" },
          createdAt: { type: "string", format: "date-time" },
        },
        required: ["id", "name", "email", "role"],
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          name: { type: "string", example: "Technical Support" },
          createdAt: { type: "string", format: "date-time" },
          ticketsCount: { type: "integer", example: 3 },
        },
        required: ["id", "name"],
      },
      Ticket: {
        type: "object",
        properties: {
          id: { type: "integer", example: 1 },
          title: { type: "string", example: "Cannot sign in" },
          description: { type: "string", example: "User cannot access the account." },
          status: {
            type: "string",
            enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"],
            example: "OPEN",
          },
          priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], example: "HIGH" },
          creatorId: { type: "integer", example: 1 },
          categoryId: { type: "integer", example: 1 },
          creator: { $ref: "#/components/schemas/User" },
          category: { $ref: "#/components/schemas/Category" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
        required: ["id", "title", "description", "status", "priority"],
      },
      AuthResponse: {
        type: "object",
        properties: {
          data: {
            type: "object",
            properties: {
              accessToken: { type: "string", example: "header.payload.signature" },
              user: { $ref: "#/components/schemas/User" },
            },
            required: ["accessToken", "user"],
          },
        },
        required: ["data"],
      },
    },
  },
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Check API availability",
        responses: {
          "200": {
            description: "API is running",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                    service: { type: "string", example: "helpdesk-api" },
                    timestamp: { type: "string", format: "date-time" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/status": {
      get: {
        tags: ["Monitoring"],
        summary: "Get Node.js process metrics",
        responses: {
          "200": {
            description: "Runtime status and performance metrics",
          },
        },
      },
    },
    "/upload": {
      post: {
        tags: ["Monitoring"],
        summary: "Upload one file",
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  file: {
                    type: "string",
                    format: "binary",
                  },
                },
                required: ["file"],
              },
            },
          },
        },
        responses: {
          "201": { description: "File uploaded successfully" },
          "400": { description: "Invalid upload request" },
          "413": { description: "File is too large" },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Lab User" },
                  email: { type: "string", example: "lab.user@example.com" },
                  password: { type: "string", example: "password123" },
                  passwordConfirmation: { type: "string", example: "password123" },
                },
                required: ["name", "email", "password", "passwordConfirmation"],
              },
            },
          },
        },
        responses: {
          "201": { description: "User registered", content: jsonRef("AuthResponse") },
          "400": { description: "Validation error", content: jsonRef("ErrorResponse") },
          "409": { description: "Email already exists", content: jsonRef("ErrorResponse") },
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Log in by email and password",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", example: "lab.user@example.com" },
                  password: { type: "string", example: "password123" },
                },
                required: ["email", "password"],
              },
            },
          },
        },
        responses: {
          "200": { description: "Login successful", content: jsonRef("AuthResponse") },
          "400": { description: "Validation error", content: jsonRef("ErrorResponse") },
          "401": { description: "Invalid credentials", content: jsonRef("ErrorResponse") },
        },
      },
    },
    "/api/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current authenticated user",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Current user", content: jsonDataRef("User") },
          "401": { description: "Unauthorized", content: jsonRef("ErrorResponse") },
        },
      },
    },
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "Get all users",
        responses: {
          "200": {
            description: "Users list",
            content: jsonArrayDataRef("User"),
          },
        },
      },
      post: {
        tags: ["Users"],
        summary: "Create user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Support Agent" },
                  email: { type: "string", example: "agent@example.com" },
                  password: { type: "string", example: "password123" },
                  passwordConfirmation: { type: "string", example: "password123" },
                  role: { type: "string", enum: ["USER", "AGENT", "ADMIN"], example: "AGENT" },
                },
                required: ["name", "email", "password", "passwordConfirmation"],
              },
            },
          },
        },
        responses: {
          "201": { description: "User created", content: jsonDataRef("User") },
          "400": { description: "Validation error", content: jsonRef("ErrorResponse") },
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        summary: "Get categories with ticket counters",
        responses: {
          "200": {
            description: "Categories list",
            content: jsonArrayDataRef("Category"),
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create category",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string", example: "Billing" },
                },
                required: ["name"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Category created", content: jsonDataRef("Category") },
          "400": { description: "Validation error", content: jsonRef("ErrorResponse") },
        },
      },
    },
    "/api/tickets": {
      get: {
        tags: ["Tickets"],
        summary: "Get paginated and filtered ticket list",
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "limit", in: "query", schema: { type: "integer", default: 10 } },
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "priority", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } },
        ],
        responses: {
          "200": {
            description: "Paginated tickets",
            content: jsonArrayDataRef("Ticket"),
          },
        },
      },
      post: {
        tags: ["Tickets"],
        summary: "Create ticket",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string", example: "Cannot sign in" },
                  description: { type: "string", example: "User cannot access the account." },
                  priority: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], example: "HIGH" },
                  creatorId: { type: "integer", example: 1 },
                  categoryId: { type: "integer", example: 1 },
                },
                required: ["title", "description", "creatorId", "categoryId"],
              },
            },
          },
        },
        responses: {
          "201": { description: "Ticket created", content: jsonDataRef("Ticket") },
          "400": { description: "Validation error", content: jsonRef("ErrorResponse") },
        },
      },
    },
    "/api/tickets/{id}": {
      get: {
        tags: ["Tickets"],
        summary: "Get ticket by id",
        parameters: [pathIdParam()],
        responses: {
          "200": { description: "Ticket", content: jsonDataRef("Ticket") },
          "404": { description: "Ticket not found", content: jsonRef("ErrorResponse") },
        },
      },
      patch: {
        tags: ["Tickets"],
        summary: "Update ticket by id",
        parameters: [pathIdParam()],
        responses: {
          "200": { description: "Ticket updated", content: jsonDataRef("Ticket") },
          "400": { description: "Validation error", content: jsonRef("ErrorResponse") },
          "404": { description: "Ticket not found", content: jsonRef("ErrorResponse") },
        },
      },
      delete: {
        tags: ["Tickets"],
        summary: "Delete ticket by id",
        parameters: [pathIdParam()],
        responses: {
          "204": { description: "Ticket deleted" },
          "404": { description: "Ticket not found", content: jsonRef("ErrorResponse") },
        },
      },
    },
  },
};

function jsonRef(schemaName: SchemaName) {
  return {
    "application/json": {
      schema: { $ref: `#/components/schemas/${schemaName}` },
    },
  };
}

function jsonDataRef(schemaName: SchemaName) {
  return {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          data: { $ref: `#/components/schemas/${schemaName}` },
        },
      },
    },
  };
}

function jsonArrayDataRef(schemaName: SchemaName) {
  return {
    "application/json": {
      schema: {
        type: "object",
        properties: {
          data: {
            type: "array",
            items: { $ref: `#/components/schemas/${schemaName}` },
          },
        },
      },
    },
  };
}

function pathIdParam() {
  return {
    name: "id",
    in: "path",
    required: true,
    schema: {
      type: "integer",
    },
  };
}
