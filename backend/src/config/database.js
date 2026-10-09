// src/config/database.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { env } from './env.js';

const globalForPrisma = globalThis;

function createPrismaClient() {
  // Creamos el adapter de PostgreSQL con la URL de conexión
  const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });

  return new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;