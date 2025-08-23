import { PrismaClient } from "@prisma/client";

// Prevent multiple PrismaClient instances in dev
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // optional: logs SQL queries in dev
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
