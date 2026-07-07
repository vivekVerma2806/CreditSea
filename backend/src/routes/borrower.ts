import { Router, Response } from 'express';
import { AuthRequest, authenticate } from '../middlewares/auth';
import { BorrowerProfile, EmploymentMode } from '../models/BorrowerProfile';
import { Loan } from '../models/Loan';
import multer from 'multer';
import path from 'path';

const router = Router();
router.use(authenticate);

// Fetch borrower profile and loans
router.get('/loans', async (req: AuthRequest, res: Response) => {
  try {
    const profile = await BorrowerProfile.findOne({ userId: req.user!.id });
    if (!profile) {
      return res.json({ loans: [], profileExists: false });
    }
    const loans = await Loan.find({ borrowerId: profile._id }).sort({ createdAt: -1 });
    res.json({ loans, profileExists: true });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const authReq = req as AuthRequest;
    cb(null, `${authReq.user?.id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, JPG, and PNG are allowed'));
    }
  },
});

router.post('/profile', async (req: AuthRequest, res: Response) => {
  try {
    const { pan, dob, monthlySalary, employmentMode } = req.body;

    // BRE Checks
    const age = new Date().getFullYear() - new Date(dob).getFullYear();
    if (age < 23 || age > 50) return res.status(400).json({ message: 'BRE Rejected: Age not between 23 and 50' });
    if (monthlySalary < 25000) return res.status(400).json({ message: 'BRE Rejected: Salary below 25,000 / month' });
    if (employmentMode === EmploymentMode.Unemployed) return res.status(400).json({ message: 'BRE Rejected: Applicant is Unemployed' });
    
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!panRegex.test(pan)) return res.status(400).json({ message: 'BRE Rejected: Invalid PAN format' });

    let profile = await BorrowerProfile.findOne({ userId: req.user!.id });
    if (profile) {
      profile.pan = pan;
      profile.dob = dob;
      profile.monthlySalary = monthlySalary;
      profile.employmentMode = employmentMode;
      await profile.save();
    } else {
      profile = await BorrowerProfile.create({ userId: req.user!.id, pan, dob, monthlySalary, employmentMode });
    }

    res.json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/upload-slip', upload.single('salarySlip'), async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const profile = await BorrowerProfile.findOne({ userId: req.user!.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    profile.salarySlipUrl = `/uploads/${req.file.filename}`;
    await profile.save();

    res.json({ message: 'File uploaded successfully', url: profile.salarySlipUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/loan', async (req: AuthRequest, res: Response) => {
  try {
    const { amount, tenure } = req.body;

    if (amount < 50000 || amount > 500000) return res.status(400).json({ message: 'Amount must be between 50K and 5L' });
    if (tenure < 30 || tenure > 365) return res.status(400).json({ message: 'Tenure must be between 30 and 365 days' });

    const profile = await BorrowerProfile.findOne({ userId: req.user!.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });

    const interestRate = 0.12; // 12%
    const simpleInterest = (amount * interestRate * tenure) / 365;
    const totalRepayment = amount + simpleInterest;

    const loan = await Loan.create({
      borrowerId: profile._id,
      amount,
      tenure,
      totalRepayment,
    });

    res.json({ message: 'Loan application submitted', loan });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router;
