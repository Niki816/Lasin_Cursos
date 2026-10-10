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

// ===== SEGURIDAD =====
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ===== CORS =====
const allowedOrigins = env.NODE_ENV === 'development'
  ? [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001',
    ]
  : [env.FRONTEND_URL];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir peticiones sin origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`[CORS] ❌ Origen bloqueado: ${origin}`);
        callback(new Error(`Origen no permitido por CORS: ${origin}`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Disposition'],
    maxAge: 86400, // Cachear preflight por 24h
  })
);

// ===== RATE LIMITING =====
// Solo activo en producción. En desarrollo no limita.
if (env.NODE_ENV === 'production') {
  // Rate limit general para la API
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200,
    message: {
      status: 'error',
      message: 'Demasiadas peticiones, intenta más tarde',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
  });

  // Rate limit estricto para login (anti-brute-force)
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: {
      status: 'error',
      message: 'Demasiados intentos de login, espera 15 minutos',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // No contar logins exitosos
  });

  // Rate limit moderado para preinscripciones (anti-spam)
  const preinscripcionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20,
    message: {
      status: 'error',
      message: 'Demasiadas preinscripciones desde esta IP',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api/', apiLimiter);
  app.use('/api/auth/login', loginLimiter);
  app.use('/api/auth/register', loginLimiter);
  app.use('/api/preinscripciones', (req, res, next) => {
    // Solo aplicar en POST (crear), no en GETs
    if (req.method === 'POST') return preinscripcionLimiter(req, res, next);
    next();
  });

  console.log('🔒 Rate limiting activado (production)');
} else {
  console.log('⚠️  Rate limiting desactivado (development)');
}

// ===== BODY PARSING =====
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ===== HEALTH CHECK =====
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: env.NODE_ENV,
  });
});

// ===== LOGGER DE PETICIONES (solo dev) =====
if (env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const statusEmoji =
        res.statusCode >= 500 ? '🔴' : res.statusCode >= 400 ? '🟡' : '🟢';
      console.log(
        `${statusEmoji} ${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`
      );
    });
    next();
  });
}

// ===== RUTAS =====
app.use('/api/auth', authRoutes);
app.use('/api/cursos', cursoRoutes);
app.use('/api/preinscripciones', preinscripcionRoutes);
app.use('/api/export', exportRoutes);

// ===== 404 =====
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

// ===== ERROR HANDLER =====
app.use(errorHandler);

export default app;