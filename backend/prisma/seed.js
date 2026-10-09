// prisma/seed.js
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcryptjs';

// Crear adapter y cliente (Prisma 7 lo requiere)
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@lasin.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!';

  const existente = await prisma.usuario.findUnique({ where: { email: adminEmail } });

  if (existente) {
    console.log(`ℹ️  Usuario admin ya existe: ${adminEmail}`);
  } else {
    const passwordHash = await bcrypt.hash(adminPassword, 12);
    await prisma.usuario.create({
      data: {
        nombre: 'Administrador',
        email: adminEmail,
        passwordHash,
        rol: 'admin',
      },
    });
    console.log(`✅ Usuario admin creado:`);
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Password: ${adminPassword}`);
    console.log(`   ⚠️  Cambia esta contraseña en producción`);
  }

  console.log('✅ Seed completado');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });