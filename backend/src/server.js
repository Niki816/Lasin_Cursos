import app from './app.js';
import { env } from './config/env.js';
import prisma from './config/database.js';

const PORT = env.PORT || 3000;

async function startServer() {
  try {
    // Verificar conexión a base de datos
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL (Neon)');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📦 Entorno: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();