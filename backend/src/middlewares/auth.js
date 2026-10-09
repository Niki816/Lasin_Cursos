import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { AppError } from './errorHandler.js';
import prisma from '../config/database.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('No autorizado, token requerido', 401);
    }

    const decoded = jwt.verify(token, env.JWT_SECRET);
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.id },
      select: { id: true, nombre: true, email: true, rol: true, activo: true },
    });

    if (!usuario || !usuario.activo) {
      throw new AppError('Usuario no encontrado o inactivo', 401);
    }

    req.usuario = usuario;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return next(new AppError('Token inválido', 401));
    }
    if (error.name === 'TokenExpiredError') {
      return next(new AppError('Token expirado', 401));
    }
    next(error);
  }
};

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return next(new AppError('No tienes permiso para esta acción', 403));
    }
    next();
  };
};