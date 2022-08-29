import { Router } from 'express';
import {
  createNewMaintenance,
  getAllMaintenances,
  getMaintenanceByTurbineId,
  updateMaintenance,
  deleteMaintenance,
} from '../controllers/maintenance.controller';

export const maintenanceRoute = () => {
  const router = Router();

  router.post('/maintenance', createNewMaintenance);

  router.get('/maintenance', getAllMaintenances);

  router.get('/maintenance/:turbineId', getMaintenanceByTurbineId);

  router.patch('/maintenance/:id', updateMaintenance);

  router.delete('/maintenance/:id', deleteMaintenance);

  return router;
};
