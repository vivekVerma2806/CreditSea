import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, Role } from '../models/User';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, passwordHash, role: Role.Borrower });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({ token, role: user.role, name: user.name });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

// GET or POST /seed to populate default role accounts
router.all('/seed', async (req: Request, res: Response) => {
  try {
    const roles = Object.values(Role);
    const seeded: string[] = [];

    for (const role of roles) {
      const email = `${role.toLowerCase()}@lms.com`;
      const existingUser = await User.findOne({ email });

      if (!existingUser) {
        const passwordHash = await bcrypt.hash('password123', 10);
        await User.create({
          name: `${role} User`,
          email,
          passwordHash,
          role,
        });
        seeded.push(`${role} (${email})`);
      }
    }

    res.json({
      message: 'Database seeded successfully',
      seeded: seeded.length > 0 ? seeded : 'All default role accounts already exist'
    });
  } catch (error) {
    res.status(500).json({ message: 'Seeding failed', error });
  }
});

export default router;
