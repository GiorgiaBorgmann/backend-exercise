import { Request, Response } from 'express';
import Pick from 'lodash.pick';
import { Farms, FarmInput } from '../models/farms.model';

export const createNewFarm = async (req: Request, res: Response) => {
  const { email, name, turbins } = req.body;
  if (!name || !email || !turbins) {
    return res.status(422).json({ message: 'Missing required fields' });
  }
  const FarmInput: FarmInput = {
    email,
    name,
    turbins,
  };
  const farmCreated = await Farms.create(FarmInput);
  return res.status(201).json({ data: farmCreated });
};

export const getAllFarms = async (req: Request, res: Response) => {
  const farms = await Farms.find().sort('-createdAt').exec();
  return res.status(200).json({ data: farms });
};

const findFarm = async (res: Response, id: string) => {
  const farm = await Farms.findOne({ _id: id });
  if (!farm) {
    return res.status(404).json({ message: `Farms with id "${id}" not found.` });
  }
  return farm;
};

export const getFarmById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const farm = await findFarm(res, id);
  return res.status(200).json({ data: farm });
};

export const deleteFarm = async (req: Request, res: Response) => {
  const { id } = req.params;
  await findFarm(res, id);
  await Farms.findByIdAndDelete(id);
  return res.status(200).json({ message: 'Farm deleted successfully.' });
};

export const updateFarm = async (req: Request, res: Response) => {
  const { id } = req.params;
  await findFarm(res, id);
  const update = Pick(req.body, ['name', 'email', 'turbines']);
  const farmUpdated = await Farms.findByIdAndUpdate(id, { $set: update }, { new: true });
  return res.status(200).json({ data: farmUpdated });
};
