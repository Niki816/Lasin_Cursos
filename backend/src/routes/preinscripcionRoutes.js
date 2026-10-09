import { Router } from 'express';
import {
  crearPreinscripcion,
  listarPreinscripciones,
  obtenerPreinscripcion,
  cambiarEstado,
  actualizarComprobante,
} from '../controllers/preinscripcionController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// Pública: cualquier visitante puede preinscribirse
router.post('/', upload.single('comprobante'), crearPreinscripcion);

// Protegidas (admin)
router.use(protect, restrictTo('admin'));

router.get('/', listarPreinscripciones);
router.get('/:id', obtenerPreinscripcion);
router.patch('/:id/estado', cambiarEstado);
router.patch('/:id/comprobante', upload.single('comprobante'), actualizarComprobante);

export default router;