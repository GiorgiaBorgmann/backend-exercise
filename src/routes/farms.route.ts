import { Router } from 'express';
import { createNewFarm, deleteFarm, getAllFarms, getFarmById, updateFarm } from '../controllers/farms.controller';

export const farmsRoute = () => {
  const router = Router();

  router.post('/farms', createNewFarm);

  router.get('/farms', getAllFarms);

  router.get('/farms/:id', getFarmById);

  router.put('/farms/:id', updateFarm);

  router.delete('/farms/:id', deleteFarm);

  return router;
};
