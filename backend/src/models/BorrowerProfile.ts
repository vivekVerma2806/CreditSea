import mongoose, { Document, Schema } from 'mongoose';

export enum EmploymentMode {
  Salaried = 'Salaried',
  SelfEmployed = 'Self-Employed',
  Unemployed = 'Unemployed',
}

export interface IBorrowerProfile extends Document {
  userId: mongoose.Types.ObjectId;
  pan: string;
  dob: Date;
  monthlySalary: number;
  employmentMode: EmploymentMode;
  salarySlipUrl?: string;
}

const borrowerProfileSchema = new Schema<IBorrowerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    pan: { type: String, required: true },
    dob: { type: Date, required: true },
    monthlySalary: { type: Number, required: true },
    employmentMode: { type: String, enum: Object.values(EmploymentMode), required: true },
    salarySlipUrl: { type: String },
  },
  { timestamps: true }
);

export const BorrowerProfile = mongoose.model<IBorrowerProfile>('BorrowerProfile', borrowerProfileSchema);
