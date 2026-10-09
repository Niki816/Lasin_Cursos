import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import cursoRoutes from './routes/cursoRoutes.js';
import preinscripcionRoutes from './routes/preinscripcionRoutes.js';
import exportRoutes from './routes/exportRoutes.js';

const app = express();

// Seguridad
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: env.NODE_ENV === 'development' ? 10000 : 100, // En dev permitir muchas
  message: { status: 'error', message: 'Demasiadas peticiones, intenta más tarde' },
  standardHeaders: true,
  legacyHeaders: false,
  // En desarrollo, no contar peticiones OPTIONS (preflight CORS)
  skip: (req) => env.NODE_ENV === 'development' && req.method === 'OPTIONS',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/preinscripciones', preinscripcionRoutes);
app.use('/api/export', exportRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Ruta no encontrada' });
});

// Error handler (Express 5 captura async errors automáticamente)[citation:2]
app.use(errorHandler);

export default app;