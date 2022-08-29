import { Router } from 'express';
import {
  createNewTurbine,
  getAllTurbines,
  getTurbineById,
  updateTurbine,
  deleteTurbine,
  getAllMaintenanceAndBrokeTurbines,
  getTurbineInPolygon,
} from '../controllers/turbines.controller';

export const turbinesRoute = () => {
  const router = Router();

  router.post('/turbines', createNewTurbine);

  router.get('/turbines', getAllTurbines);

  router.post('/turbines/inside-polygon', getTurbineInPolygon);

  router.get('/turbines/maintenance-broke', getAllMaintenanceAndBrokeTurbines);

  router.get('/turbines/:id', getTurbineById);

  router.patch('/turbines/:id', updateTurbine);

  router.delete('/turbines/:id', deleteTurbine);

  return router;
};
