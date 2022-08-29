import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export enum MaintenanceStatus {
  working = 'Working',
  broke = 'Broke',
  fixed = 'Fixed',
}
export type MaintenanceDocument = Document & {
  description: string;
  status: MaintenanceStatus;
  turbineId: Types.ObjectId;
};

export type MaintenanceInput = {
  turbineId: MaintenanceDocument['turbineId'];
  status: MaintenanceDocument['status'];
  description: MaintenanceDocument['description'];
};

const maintenanceSchema = new Schema(
  {
    description: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: MaintenanceStatus,
      required: true,
    },
    turbineId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    collection: 'maintenance',
    timestamps: true,
  },
);

export const Maintenance: Model<MaintenanceDocument> = mongoose.model<MaintenanceDocument>('Maintenance', maintenanceSchema);
