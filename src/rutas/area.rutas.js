import { Router } from 'express';
import AreaServicio from '../servicios/area.servicios.js';
import AreaControlador from '../controladores/area.controlador.js';

const router = new Router();
const areaServicio = new AreaServicio();
const areaControlador = new AreaControlador({ areaServicio });

router.get('/', areaControlador.obtenerTodos);
router.get('/:id', areaControlador.obtenerAreaPorId);
router.post('/', areaControlador.crearArea);
router.put('/:id', areaControlador.actualizarArea);
router.delete('/:id', areaControlador.eliminarArea);

export default router;