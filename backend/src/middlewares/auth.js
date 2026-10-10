import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';
import prisma from '../config/database.js';

/**
 * Middleware de autenticación.
 * Extrae el token JWT del header Authorization y lo verifica.
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Buscar token en el header Authorization
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    }

    // 2. Alternativa: cookie (para futuro uso con httpOnly)
    if (!token && req.cookies?.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      console.warn(`[AUTH] ❌ Token no proporcionado en ${req.method} ${req.originalUrl}`);
      throw new AppError('No autorizado, token requerido', 401);
    }

    // 3. Verificar token
    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === 'JsonWebTokenError') {
        console.warn(`[AUTH] ❌ Token inválido: ${jwtError.message}`);
        throw new AppError('Token inválido', 401);
      }
      if (jwtError.name === 'TokenExpiredError') {
        console.warn(`[AUTH] ❌ Token expirado`);
        throw new AppError('Token expirado, inicia sesión nuevamente', 401);
      }
      throw jwtError;
    }

    // 4. Buscar usuario en la BD
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
      },
    });

    if (!usuario) {
      console.warn(`[AUTH] ❌ Usuario ${decoded.id} no existe`);
      throw new AppError('Usuario no encontrado', 401);
    }

    if (!usuario.activo) {
      console.warn(`[AUTH] ❌ Usuario ${decoded.id} inactivo`);
      throw new AppError('Usuario inactivo', 401);
    }

    // 5. Adjuntar usuario al request
    req.usuario = usuario;
    console.log(`[AUTH] ✅ ${req.method} ${req.originalUrl} - Usuario: ${usuario.email}`);
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware de autorización por rol.
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return next(new AppError('No autenticado', 401));
    }

    if (!roles.includes(req.usuario.rol)) {
      console.warn(
        `[AUTH] ❌ Usuario ${req.usuario.email} con rol "${req.usuario.rol}" intentó acceder a recurso restringido`
      );
      return next(
        new AppError('No tienes permiso para realizar esta acción', 403)
      );
    }

    next();
  };
};

/**
 * Middleware opcional para loggear el token recibido (útil para debug).
 * Solo activo en development.
 */
export const debugToken = (req, res, next) => {
  if (env.NODE_ENV === 'development') {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const tokenPreview = authHeader.substring(0, 30) + '...';
      console.log(`[DEBUG] Token recibido: ${tokenPreview}`);
    } else {
      console.log(`[DEBUG] Sin header Authorization en ${req.method} ${req.originalUrl}`);
    }
  }
  next();
};