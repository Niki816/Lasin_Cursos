import { Router } from 'express';
import {
  listarCursos,
  obtenerCurso,
  crearCurso,
  actualizarCurso,
  eliminarCurso,
  actualizarWhatsapp,
} from '../controllers/cursoController.js';
import { protect, restrictTo } from '../middlewares/auth.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

// Rutas públicas
router.get('/', listarCursos);
router.get('/:id', obtenerCurso);

// Rutas protegidas (admin)
router.use(protect, restrictTo('admin'));

router.post('/', upload.single('afiche'), crearCurso);
router.put('/:id', upload.single('afiche'), actualizarCurso);
router.delete('/:id', eliminarCurso);
router.patch('/:id/whatsapp', actualizarWhatsapp);

export default router;