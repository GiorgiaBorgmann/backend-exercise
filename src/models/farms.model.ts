import mongoose, { Schema, Model, Document, Types } from 'mongoose';

export type FarmsDocument = Document & {
  name: string;
  turbins: Types.ObjectId[];
  email: string;
};

export type FarmInput = {
  name: FarmsDocument['name'];
  turbins: FarmsDocument['turbins'];
  email: FarmsDocument['email'];
};

export const farmsSchema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      unique: true,
    },
    email: {
      type: Schema.Types.String,
      required: true,
    },
    turbins: {
      type: [Schema.Types.ObjectId],
      required: true,
    },
  },
  {
    collection: 'farms',
    timestamps: true,
  },
);

export const Farms: Model<FarmsDocument> = mongoose.model<FarmsDocument>('Farm', farmsSchema);
