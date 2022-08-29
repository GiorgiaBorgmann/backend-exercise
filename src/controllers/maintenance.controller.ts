import { Request, Response } from 'express';
import Pick from 'lodash.pick';
import { Types } from 'mongoose';
import { Maintenance, MaintenanceDocument, MaintenanceInput } from '../models/maintenance.model';
import { Turbine, TurbineDocument } from '../models/turbines.model';
import { findTurbine } from './turbines.controller';

export const createNewMaintenance = async (req: Request, res: Response) => {
  const { description, status, turbineId } = req.body;
  if (!description || !turbineId || !status) {
    return res.status(422).json({ message: 'Missing required fields ' });
  }
  const turbine = (await findTurbine(res, turbineId)) as TurbineDocument;
  const MaintenanceInput: MaintenanceInput = {
    turbineId,
    status,
    description,
  };
  const maintenanceCreated = await Maintenance.create(MaintenanceInput);
  if (turbine && maintenanceCreated) {
    turbine.maintenance.push(Types.ObjectId(maintenanceCreated._id));
    const update = Pick(turbine, ['name', 'location', 'status', 'maintenance']);
    await Turbine.findByIdAndUpdate(turbineId, { $set: update }, { new: true });
    return res.status(201).json({ data: maintenanceCreated });
  }
  return res.status(500);
};

export const getAllMaintenances = async (req: Request, res: Response) => {
  const maintenances = await Maintenance.find().sort('-createdAt').exec();

  return res.status(200).json({ data: maintenances });
};

const findMaintenance = async (res: Response, id: string) => {
  const maintenance = await Maintenance.findOne({ _id: id });
  if (!maintenance) {
    return res.status(404).json({ message: `Maintenance with id "${id}" not found.` });
  }
  return maintenance;
};

export const updateMaintenance = async (req: Request, res: Response) => {
  const { id } = req.params;
  await findMaintenance(res, id);
  const update = Pick(req.body, ['description', 'turbineId', 'status']);
  const maintenanceUpdated = await Maintenance.findByIdAndUpdate(id, { $set: update }, { new: true });
  return res.status(200).json({ data: maintenanceUpdated });
};

export const deleteMaintenance = async (req: Request, res: Response) => {
  const { id } = req.params;
  const maintenance = (await findMaintenance(res, id)) as MaintenanceDocument;
  const turbine = (await findTurbine(res, maintenance.turbineId.toString())) as TurbineDocument;
  await Maintenance.findByIdAndDelete(id);
  turbine.maintenance = turbine.maintenance.filter((item) => item.toString() !== maintenance.turbineId.toString());
  const update = Pick(turbine, ['name', 'location', 'status', 'maintenance']);
  await Turbine.findByIdAndUpdate(maintenance.turbineId.toString(), { $set: update }, { new: true });
  return res.status(200).json({ message: 'Maintenance deleted successfully.' });
};

export const getMaintenanceByTurbineId = async (req: Request, res: Response) => {
  const { turbineId } = req.params;
  const maintenance = await Maintenance.find({ turbineId: turbineId }).sort('-createdAt').exec();
  return res.status(200).json({ data: maintenance });
};
