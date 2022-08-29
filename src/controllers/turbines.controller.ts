import { Request, Response } from 'express';
import { Turbine, TurbineDocument, TurbineInput, TurbineStatus } from '../models/turbines.model';
import Pick from 'lodash.pick';

export const createNewTurbine = async (req: Request, res: Response) => {
  const { name, location, status, maintenance } = req.body;
  if (!name || !location || !status || !maintenance) {
    return res.status(422).json({ message: 'Missing required fields' });
  }
  const turbineInput: TurbineInput = {
    name,
    location,
    status,
    maintenance,
  };
  const turbineCreated = await Turbine.create(turbineInput);
  return res.status(201).json({ data: turbineCreated });
};

const findAllTurbines = async () => {
  return await Turbine.find().sort('-createdAt').exec();
};

export const getAllTurbines = async (req: Request, res: Response) => {
  const turbines = await findAllTurbines();
  return res.status(200).json({ data: turbines });
};

export const findTurbine = async (res: Response, id: string) => {
  const turbine = await Turbine.findOne({ _id: id });
  if (!turbine) {
    return res.status(404).json({ message: `Turbine with id "${id}" not found.` });
  }
  return turbine;
};

export const getTurbineById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const turbine = await findTurbine(res, id);
  return res.status(200).json({ data: turbine });
};

export const updateTurbine = async (req: Request, res: Response) => {
  const { id } = req.params;
  await findTurbine(res, id);
  const update = Pick(req.body, ['name', 'location', 'status', 'maintenance']);
  const turbineUpdated = await Turbine.findByIdAndUpdate(id, { $set: update }, { new: true });
  return res.status(200).json({ data: turbineUpdated });
};

export const deleteTurbine = async (req: Request, res: Response) => {
  const { id } = req.params;
  await findTurbine(res, id);
  await Turbine.findByIdAndDelete(id);
  return res.status(200).json({ message: 'Turbine deleted successfully.' });
};

export const getAllMaintenanceAndBrokeTurbines = async (req: Request, res: Response) => {
  const turbines = await Turbine.find({ status: { $ne: TurbineStatus.working } })
    .sort('-createdAt')
    .exec();

  return res.status(200).json({ data: turbines });
};

const checkInsidePolygon = (point, polygon) => {
  const x = point[0];
  const y = point[1];

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect = yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    intersect ? (inside = !inside) : (inside = inside);
  }

  return inside;
};

export const getTurbineInPolygon = async (req: Request, res: Response) => {
  const { polygon } = req.body;
  const turbines = await findAllTurbines();
  const turbinsInside: TurbineDocument[] = [];
  for (let i = 0; i < turbines.length; i++) {
    const inside = checkInsidePolygon(turbines[i].location, polygon);
    if (inside) turbinsInside.push(turbines[i]);
  }

  return res.status(200).json({ data: turbinsInside });
};
