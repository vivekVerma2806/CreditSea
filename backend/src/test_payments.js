const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lms';
const BACKEND_URL = 'http://localhost:5000/api';

async function testUTRAndClosure() {
  console.log('Connecting to database:', MONGO_URI);
  await mongoose.connect(MONGO_URI);
  console.log('Database connected successfully.');

  try {
    // 1. Authenticate Collection Exec
    console.log('\n--- 1. Authenticating test accounts ---');
    
    const collLoginRes = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'collection@lms.com', password: 'password123' })
    });
    const collData = await collLoginRes.json();
    const collectionToken = collData.token;
    console.log('Authenticated Collection Executive successfully.');

    // 2. Fetch or create a loan
    console.log('\n--- 2. Fetching/Creating active loan ---');
    
    // Register mongoose schemas manually if needed, or query direct collections
    const db = mongoose.connection.db;
    const usersColl = db.collection('users');
    const profilesColl = db.collection('borrowerprofiles');
    const loansColl = db.collection('loans');
    const paymentsColl = db.collection('payments');

    const borrowerUser = await usersColl.findOne({ email: 'borrower@lms.com' });
    if (!borrowerUser) {
      throw new Error('borrower@lms.com not found. Please run seed script first.');
    }
    
    let profile = await profilesColl.findOne({ userId: borrowerUser._id });
    if (!profile) {
      const result = await profilesColl.insertOne({
        userId: borrowerUser._id,
        pan: 'ABCDE1234F',
        dob: new Date('1995-01-01'),
        monthlySalary: 50000,
        employmentMode: 'Salaried',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      profile = { _id: result.insertedId };
    }

    // Clean up previous payments/records to ensure a clean state
    await paymentsColl.deleteMany({ utr: { $in: ['UTR001', 'UTR002', 'UTR003'] } });
    console.log('Cleared existing payments for UTR001, UTR002, UTR003.');

    // Ensure we start with a clean disbursed loan of ₹1,00,000
    // Total repayment = Principal (100000) + Interest (12% for 90 days = 2958) = 102958
    await loansColl.deleteMany({ borrowerId: profile._id, status: { $in: ['Disbursed', 'Closed'] } });
    
    const loanResult = await loansColl.insertOne({
      borrowerId: profile._id,
      amount: 100000,
      tenure: 90,
      status: 'Disbursed',
      totalRepayment: 102958,
      amountPaid: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    const loanId = loanResult.insertedId;
    console.log(`Created clean Disbursed loan. ID: ${loanId}. Total due: ₹102,958`);

    // 3. Post first payment with UTR001
    console.log('\n--- 3. Recording first payment with UTR001 ---');
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${collectionToken}` 
    };

    try {
      const payRes1 = await fetch(`${BACKEND_URL}/dashboard/collection/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          loanId: loanId.toString(),
          utr: 'UTR001',
          amount: 10000
        })
      });
      const payData1 = await payRes1.json();
      console.log('First Payment Status:', payRes1.status);
      console.log('First Payment Result:', payData1.message);
      console.log('Loan Status:', payData1.loanStatus, `| Amount Paid: ₹${payData1.payment.amount}`);
    } catch (err) {
      console.error('First payment failed unexpectedly:', err.message);
    }

    // 4. Post second payment with same UTR001 (should fail)
    console.log('\n--- 4. Recording duplicate payment with UTR001 ---');
    try {
      const payRes2 = await fetch(`${BACKEND_URL}/dashboard/collection/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          loanId: loanId.toString(),
          utr: 'UTR001',
          amount: 10000
        })
      });
      const payData2 = await payRes2.json();
      console.log('Second Payment Response Status:', payRes2.status);
      console.log('Second Payment Response Data:', payData2);
    } catch (err) {
      console.error('Second payment request failed:', err.message);
    }

    // 5. Keep paying until full amount is paid
    console.log('\n--- 5. Recording remaining payments ---');
    
    // Remaining balance is 102958 - 10000 = 92958
    // Let's pay ₹50,000 with UTR002
    try {
      const payRes3 = await fetch(`${BACKEND_URL}/dashboard/collection/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          loanId: loanId.toString(),
          utr: 'UTR002',
          amount: 50000
        })
      });
      const payData3 = await payRes3.json();
      console.log('Second Payment (UTR002) Status:', payRes3.status, '| Message:', payData3.message);
      console.log('Loan Status:', payData3.loanStatus);
    } catch (err) {
      console.error('UTR002 payment failed:', err.message);
    }

    // Let's pay final balance ₹42,958 with UTR003
    try {
      const payRes4 = await fetch(`${BACKEND_URL}/dashboard/collection/payments`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          loanId: loanId.toString(),
          utr: 'UTR003',
          amount: 42958
        })
      });
      const payData4 = await payRes4.json();
      console.log('Final Payment (UTR003) Status:', payRes4.status, '| Message:', payData4.message);
      console.log('Loan Status after final payment:', payData4.loanStatus);
    } catch (err) {
      console.error('UTR003 payment failed:', err.message);
    }

    // 6. Verify status in database
    console.log('\n--- 6. Final verification in Database ---');
    const finalLoan = await loansColl.findOne({ _id: loanId });
    console.log('Final Loan Status in DB:', finalLoan.status);
    console.log('Total Repayment Due:', finalLoan.totalRepayment);
    console.log('Total Amount Paid:', finalLoan.amountPaid);

  } catch (error) {
    console.error('Test execution error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDatabase disconnected.');
  }
}

testUTRAndClosure();
