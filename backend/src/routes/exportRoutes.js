import { Router } from 'express';
import { exportarPDF, exportarExcel } from '../controllers/exportController.js';
import { protect, restrictTo } from '../middlewares/auth.js';

const router = Router();

router.use(protect, restrictTo('admin'));

router.get('/:cursoId/pdf', exportarPDF);
router.get('/:cursoId/excel', exportarExcel);

export default router;