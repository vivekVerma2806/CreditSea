import mongoose, { Document, Schema } from 'mongoose';

export enum LoanStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Disbursed = 'Disbursed',
  Closed = 'Closed',
}

export interface ILoan extends Document {
  borrowerId: mongoose.Types.ObjectId;
  amount: number;
  tenure: number;
  status: LoanStatus;
  rejectionReason?: string;
  totalRepayment: number;
  amountPaid: number;
  appliedAt: Date;
}

const loanSchema = new Schema<ILoan>(
  {
    borrowerId: { type: Schema.Types.ObjectId, ref: 'BorrowerProfile', required: true },
    amount: { type: Number, required: true },
    tenure: { type: Number, required: true },
    status: { type: String, enum: Object.values(LoanStatus), default: LoanStatus.Pending },
    rejectionReason: { type: String },
    totalRepayment: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Loan = mongoose.model<ILoan>('Loan', loanSchema);
