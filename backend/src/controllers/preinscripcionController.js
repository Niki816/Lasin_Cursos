import { z } from 'zod';
import prisma from '../config/database.js';
import { AppError } from '../utils/AppError.js';
import { uploadToCloudinary } from '../services/cloudinaryService.js';
import { sendConfirmationEmail, sendAceptadoEmail, sendRechazadoEmail } from '../services/emailService.js';

const preinscripcionSchema = z.object({
  cursoId: z.coerce.number().int().positive(),
  correo: z.string().email('Email inválido'),
  nombres: z.string().min(2, 'Nombres muy cortos'),
  apellidoPaterno: z.string().min(2, 'Apellido muy corto'),
  apellidoMaterno: z.string().optional().nullable(),
  telefono: z.string().optional().nullable(),
  ci: z.string().optional().nullable(),
  institucionEstudios: z.string().optional().nullable(),
  observaciones: z.string().optional().nullable(),
});

// POST /api/preinscripciones
export const crearPreinscripcion = async (req, res, next) => {
  try {
    const data = preinscripcionSchema.parse(req.body);

    // Verificar que el curso exista
    const curso = await prisma.curso.findUnique({ where: { id: data.cursoId } });
    if (!curso) {
      throw new AppError('Curso no encontrado', 404);
    }

    // Verificar duplicado (también protegido por @@unique en DB)
    const existente = await prisma.preinscripcion.findUnique({
      where: {
        unique_correo_curso: {
          correo: data.correo,
          cursoId: data.cursoId,
        },
      },
    });

    if (existente) {
      return res.status(409).json({
        status: 'duplicado',
        message: 'Ya estás preinscrito en este curso',
      });
    }

    // Subir comprobante a Cloudinary
    let comprobanteUrl = null;
    let comprobantePublicId = null;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer, 'comprobantes');
      comprobanteUrl = result.secure_url;
      comprobantePublicId = result.public_id;
    }

    const preinscripcion = await prisma.preinscripcion.create({
      data: {
        ...data,
        comprobanteUrl,
        comprobantePublicId,
        estado: 'pendiente',
      },
      include: { curso: true },
    });

    // Enviar email (no bloquear si falla)
    try {
      await sendConfirmationEmail(preinscripcion);
    } catch (emailError) {
      console.error('Error al enviar email de confirmación:', emailError);
    }

    res.status(201).json({ status: 'ok', preinscripcion });
  } catch (error) {
    if (error.name === 'ZodError') {
      return next(new AppError(error.errors[0].message, 400));
    }
    next(error);
  }
};

// GET /api/preinscripciones (admin)
export const listarPreinscripciones = async (req, res, next) => {
  try {
    const { cursoId, estado, search } = req.query;

    const where = {};
    if (cursoId) where.cursoId = parseInt(cursoId);
    if (estado) where.estado = estado;
    if (search) {
      where.OR = [
        { nombres: { contains: search, mode: 'insensitive' } },
        { apellidoPaterno: { contains: search, mode: 'insensitive' } },
        { correo: { contains: search, mode: 'insensitive' } },
        { ci: { contains: search, mode: 'insensitive' } },
      ];
    }

    const preinscripciones = await prisma.preinscripcion.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        curso: { select: { id: true, nombre: true, costo: true } },
      },
    });

    res.json({ status: 'ok', total: preinscripciones.length, preinscripciones });
  } catch (error) {
    next(error);
  }
};

// GET /api/preinscripciones/:id
export const obtenerPreinscripcion = async (req, res, next) => {
  try {
    const { id } = req.params;

    const preinscripcion = await prisma.preinscripcion.findUnique({
      where: { id: parseInt(id) },
      include: {
        curso: true,
        historialEstados: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!preinscripcion) {
      throw new AppError('Preinscripción no encontrada', 404);
    }

    res.json({ status: 'ok', preinscripcion });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/preinscripciones/:id/estado
export const cambiarEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado, observacion } = req.body;

    const estadosValidos = ['pendiente', 'aceptado', 'rechazado'];
    if (!estadosValidos.includes(estado)) {
      throw new AppError('Estado inválido', 400);
    }

    const preinscripcion = await prisma.preinscripcion.findUnique({
      where: { id: parseInt(id) },
      include: { curso: true },
    });

    if (!preinscripcion) {
      throw new AppError('Preinscripción no encontrada', 404);
    }

    const estadoAnterior = preinscripcion.estado;

    // Actualizar en transacción: preinscripción + historial
    const [actualizada] = await prisma.$transaction([
      prisma.preinscripcion.update({
        where: { id: parseInt(id) },
        data: {
          estado,
          observaciones: observacion
            ? `${preinscripcion.observaciones || ''}\n[${new Date().toLocaleString('es-BO')}][${estado.toUpperCase()}] ${observacion}`.trim()
            : preinscripcion.observaciones,
        },
        include: { curso: true },
      }),
      prisma.historialEstado.create({
        data: {
          preinscripcionId: parseInt(id),
          estadoAnterior,
          estadoNuevo: estado,
          observacion,
          createdBy: req.usuario?.id,
        },
      }),
    ]);

    // Enviar email según estado
    try {
      if (estado === 'aceptado') {
        await sendAceptadoEmail(actualizada, observacion);
      } else if (estado === 'rechazado') {
        await sendRechazadoEmail(actualizada, observacion);
      }
        } catch (emailError) {
          console.error('📧 [EMAIL] ❌ Falló el envío:', emailError.code, emailError.message);
        }

    res.json({ status: 'ok', preinscripcion: actualizada });
    } catch (error) {
    next(error);
  }
};

// PATCH /api/preinscripciones/:id/comprobante
export const actualizarComprobante = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!req.file) {
      throw new AppError('No se recibió archivo', 400);
    }

    const preinscripcion = await prisma.preinscripcion.findUnique({
      where: { id: parseInt(id) },
    });

    if (!preinscripcion) {
      throw new AppError('Preinscripción no encontrada', 404);
    }

    const result = await uploadToCloudinary(req.file.buffer, 'comprobantes');

    const actualizada = await prisma.preinscripcion.update({
      where: { id: parseInt(id) },
      data: {
        comprobanteUrl: result.secure_url,
        comprobantePublicId: result.public_id,
      },
    });

    res.json({ status: 'ok', preinscripcion: actualizada });
  } catch (error) {
    next(error);
  }
};