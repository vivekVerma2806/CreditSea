# CreditSea - Loan Management System

CreditSea is a premium, modern Loan Management System designed to make credit accessible, transparent, and simple for everyone. The application is built with a dual-portal design: a borrower experience for applying and tracking credit, and an executive experience for checking leads, approving sanctions, managing disbursements, and recording collections.

## 🚀 Key Features

* **Vibrant Borrower Dashboard**: Track your past loan applications with dynamic color-coded status badges and interactive summaries.
* **Intelligent AI Doubt Solver**: A floating conversational chatbot helper on the landing page that automatically resolves queries about eligibility, document size, interest rates, and NBFC regulations in real time.
* **Circular EMI Loan Calculator**: Dynamic visual SVG Donut Chart rendering Principal vs. Interest allocations with beginner-friendly jargon definitions.
* **Multi-step Loan Application Flow**: Paperless multi-step profile builder guided by an automated Business Rule Engine (BRE).
* **Role-Based Executive Dashboards**: Custom portals built for:
  * **Sales (Leads)**: View registered borrowers.
  * **Sanction**: Audit salary slips and approve/reject applications with reason tracking.
  * **Disbursement**: Handle releasing of sanctioned credit lines.
  * **Collection**: Record unique UTR reference payments, auto-close settled balances, and block duplicates.

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide icons, Axios
* **Backend**: Node.js, Express, TypeScript, Mongoose, Multer
* **Database**: MongoDB Atlas (Cloud Database)

---

## 💻 Local Setup & Running

### Prerequisites
* Node.js (v18+)
* npm (v10+)

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the backend dependencies:
   ```bash
   npm install
   ```
3. The `.env` file should have the following values loaded:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://dhruvgupta9713_db_user:Dhruv%401234@cluster0.p754fje.mongodb.net/lms?appName=Cluster0
   JWT_SECRET=supersecretjwtsecretkeyfortesting123
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser to access the website!

---

## 🧪 Testing Credentials

We have a pre-seeded set of roles for test users. Run the following command in the `backend/` directory to seed them:
```bash
npx ts-node src/seed.ts
```

### Credentials Table

| Role | Email | Password | Access Details |
| :--- | :--- | :--- | :--- |
| **Borrower** | `borrower@lms.com` | `password123` | Applies for credit, track requests on dashboard |
| **Sales** | `sales@lms.com` | `password123` | Tracks registered borrower leads |
| **Sanction** | `sanction@lms.com` | `password123` | Audits salary slip files, approves/rejects loans |
| **Disbursement** | `disbursement@lms.com` | `password123` | Releases funds to sanctioned borrowers |
| **Collection** | `collection@lms.com` | `password123` | Logs payment UTR transactions, auto-closes loans |
| **Admin** | `admin@lms.com` | `password123` | Full administrative control across all portals |

---

## 📄 Lending Partners

Operated by **Innotech CreditSea** with our licensed Non-Banking Financial Company (NBFC) lending partner:
* **Meghdoot Mercantile Private Limited** (RBI Registered Escrow Account)
