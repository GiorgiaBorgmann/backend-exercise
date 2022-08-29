import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export enum TurbineStatus {
  working = 'Working',
  broke = 'Broke',
  maintenance = 'maintenance',
}
export type TurbineDocument = Document & {
  name: string;
  status: TurbineStatus;
  location: [number];
  maintenance: Types.ObjectId[];
};

export type TurbineInput = {
  name: TurbineDocument['name'];
  status: TurbineDocument['status'];
  location: TurbineDocument['location'];
  maintenance: TurbineDocument['maintenance'];
};

const turbineSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
    },
    status: {
      type: TurbineStatus,
      required: true,
    },
    location: {
      type: [Schema.Types.Number],
      required: true,
    },
    maintenance: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
  },
  {
    collection: 'turbines',
    timestamps: true,
  },
);

export const Turbine: Model<TurbineDocument> = mongoose.model<TurbineDocument>('Turbine', turbineSchema);
