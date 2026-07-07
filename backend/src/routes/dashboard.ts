import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middlewares/auth';
import { authorize } from '../middlewares/rbac';
import { Role, User } from '../models/User';
import { Loan, LoanStatus } from '../models/Loan';
import { Payment } from '../models/Payment';

const router = Router();
router.use(authenticate);

// Sales: Pre-application stage
router.get('/sales/leads', authorize([Role.Sales]), async (req: AuthRequest, res: Response) => {
  try {
    const borrowers = await User.find({ role: Role.Borrower }).select('-passwordHash');
    res.json({ leads: borrowers });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Sanction: Review and approve/reject
router.get('/sanction/loans', authorize([Role.Sanction]), async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.Pending }).populate('borrowerId');
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.patch('/sanction/loans/:id', authorize([Role.Sanction]), async (req: AuthRequest, res: Response) => {
  try {
    const { status, rejectionReason } = req.body;
    if (status !== LoanStatus.Approved && status !== LoanStatus.Rejected) {
      return res.status(400).json({ message: 'Invalid status update' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== LoanStatus.Pending) return res.status(400).json({ message: 'Loan is not in pending state' });

    loan.status = status;
    if (status === LoanStatus.Rejected) {
      loan.rejectionReason = rejectionReason;
    }
    await loan.save();
    res.json({ message: `Loan ${status.toLowerCase()}`, loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Disbursement: Disburse approved loans
router.get('/disbursement/loans', authorize([Role.Disbursement]), async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.Approved }).populate('borrowerId');
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.patch('/disbursement/loans/:id', authorize([Role.Disbursement]), async (req: AuthRequest, res: Response) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== LoanStatus.Approved) return res.status(400).json({ message: 'Loan is not approved yet' });

    loan.status = LoanStatus.Disbursed;
    await loan.save();
    res.json({ message: 'Loan disbursed', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Collection: Track payments
router.get('/collection/loans', authorize([Role.Collection]), async (req: AuthRequest, res: Response) => {
  try {
    const loans = await Loan.find({ status: LoanStatus.Disbursed }).populate('borrowerId');
    res.json({ loans });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/collection/payments', authorize([Role.Collection]), async (req: AuthRequest, res: Response) => {
  try {
    const { loanId, utr, amount, date } = req.body;
    
    const existingPayment = await Payment.findOne({ utr });
    if (existingPayment) return res.status(400).json({ message: 'UTR must be unique' });

    const loan = await Loan.findById(loanId);
    if (!loan) return res.status(404).json({ message: 'Loan not found' });
    if (loan.status !== LoanStatus.Disbursed) return res.status(400).json({ message: 'Loan is not disbursed' });

    const payment = await Payment.create({ loanId, utr, amount, date });

    loan.amountPaid += amount;
    if (loan.amountPaid >= loan.totalRepayment) {
      loan.status = LoanStatus.Closed;
    }
    await loan.save();

    res.json({ message: 'Payment recorded', payment, loanStatus: loan.status });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
