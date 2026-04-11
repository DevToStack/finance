# Xpenso - Finance Dashboard

 A modern personal finance dashboard built with **Next.js (App Router)**, **MySQL**, and **JWT auth**. Track income/expenses, budgets, and trends with a clean, responsive UI and interactive charts.

 ## Live Demo

 - **Demo URL**: _Add your deployed link here_
 - **Screenshots**: add images under `public/screenshots/` and update the links below.

 ```
 public/screenshots/overview.png
 public/screenshots/income.png
 public/screenshots/expenses.png
 ```

 ## Key Features

 - **Authentication**
   - **Register / Login** (JWT)
   - Token stored client-side and attached to API calls

 - **Dashboard (Overview)**
   - Summary cards: balance, income, expenses, savings rate
   - Trends (line/area charts)
   - Expense category breakdown (pie)
   - Budget overview + recent transactions
   - Skeleton loaders while fetching

 - **Transactions**
   - Add / update / delete transactions (income + expense)
   - Search + category filtering (client-side)
   - UTC-safe timestamp handling (API stores UTC; UI displays local)

 - **Budgets**
   - Create monthly budgets per category
   - Progress indicators + “near limit / over budget” statuses

 - **Analytics APIs**
   - Summary totals
   - Monthly trends by year

 - **Theme**
   - Light/Dark mode
   - Theme loads *before React* to avoid flashes/hydration mismatch

 ## Core Use Cases (User Flows)

 - **New user onboarding**
   - Register -> Login -> lands on Dashboard

 - **Daily usage**
   - Log expenses/income -> dashboard totals and charts update
   - Monitor budgets -> reduce spending when alerts appear

 - **Monthly review**
   - Compare month-to-month income/expense changes
   - Use analytics charts and trends to identify spending patterns

 ## Tech Stack

 - **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Recharts, React Icons
 - **Backend**: Next.js Route Handlers (`app/api/**`)
 - **Database**: MySQL (`mysql2/promise`)
 - **Auth**: JWT (`jsonwebtoken`), password hashing (`bcryptjs`)
 - **Data Layer**: `FinanceContext` + API via `axios`

 ## Project Structure (High Level)

 ```
 app/
   api/
     auth/           # login + register
     transactions/   # CRUD
     budgets/        # CRUD
     analytics/      # summary + trends
   dashboard/        # authenticated area
   login/ register/  # auth pages
 components/
   dashboard/        # OverviewTab, IncomeTab, ExpenseTab, BudgetTab, SettingsTab
   charts/           # Recharts components
   tables/           # transaction tables, budget lists
   layout/           # DashboardLayout, Sidebar, Header
 context/
   FinanceContext.js # main app state + API calls
 lib/
   db.js             # MySQL connection pool
 middleware/
   auth.js           # JWT verification helper
 ```

 ## API Endpoints

 All routes are under `/api/*` and require `Authorization: Bearer <token>` unless noted.

 - **Auth**
   - `POST /api/auth/register` (public)
   - `POST /api/auth/login` (public)

 - **Transactions**
   - `GET /api/transactions?startDate&endDate&type&category`
   - `POST /api/transactions`
   - `PUT /api/transactions/[id]`
   - `DELETE /api/transactions/[id]`

 - **Budgets**
   - `GET /api/budgets?month=YYYY-MM`
   - `POST /api/budgets`
   - `PUT /api/budgets/[id]`
   - `DELETE /api/budgets/[id]`

 - **Analytics**
   - `GET /api/analytics/summary?startDate&endDate`
   - `GET /api/analytics/trends?year=YYYY`

 ## Environment Variables

 Create a `.env.local` file in the project root.

 ```bash
 # Auth
 JWT_SECRET=your-super-secret

 # MySQL
 MYSQL_HOST=localhost
 MYSQL_USER=root
 MYSQL_PASSWORD=
 MYSQL_DATABASE=finance_db
 MYSQL_PORT=3306

 # Optional (defaults to /api)
 NEXT_PUBLIC_API_URL=/api
 ```

 **Important**
 - Don’t commit `.env.local` to GitHub.
 - On Vercel, set these in **Project Settings -> Environment Variables**.

 ## Database Schema (Recommended)

 Your API expects at minimum these tables/columns.

 ```sql
 CREATE TABLE users (
   user_id INT AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   email VARCHAR(255) NOT NULL UNIQUE,
   password VARCHAR(255) NOT NULL,
   currency VARCHAR(10) DEFAULT 'USD',
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
 );

 CREATE TABLE transactions (
   transaction_id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT NOT NULL,
   amount DECIMAL(12,2) NOT NULL,
   category VARCHAR(100) NOT NULL,
   type ENUM('income','expense') NOT NULL,
   description VARCHAR(255) NULL,
   transaction_date DATETIME NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   INDEX idx_user_date (user_id, transaction_date),
   CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
 );

 CREATE TABLE budgets (
   budget_id INT AUTO_INCREMENT PRIMARY KEY,
   user_id INT NOT NULL,
   category VARCHAR(100) NOT NULL,
   amount DECIMAL(12,2) NOT NULL,
   month VARCHAR(7) NOT NULL, -- YYYY-MM
   spent DECIMAL(12,2) DEFAULT 0,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   UNIQUE KEY uniq_budget (user_id, category, month),
   CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
 );
 ```

 ## Local Development

 1. Install dependencies

 ```bash
 npm install
 ```

 2. Configure `.env.local` (see above)

 3. Start the dev server

 ```bash
 npm run dev
 ```

 Open:
 - `http://localhost:3000` (landing page)
 - `http://localhost:3000/register` / `http://localhost:3000/login`
 - `http://localhost:3000/dashboard`

 ## Scripts

 ```bash
 npm run dev     # Start dev server
 npm run build   # Production build
 npm run start   # Run production server
 npm run lint    # ESLint
 ```

 ## Deployment (Vercel)

 1. Push to GitHub.
 2. Import the repo into **Vercel**.
 3. Set environment variables:
    - `JWT_SECRET`
    - `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, `MYSQL_DATABASE`, `MYSQL_PORT`
 4. Provide a **cloud MySQL** database (examples):
    - **PlanetScale** (MySQL-compatible)
    - **Railway** MySQL
    - **Aiven** MySQL
 5. Run your SQL schema in that database.
 6. Deploy.

 Notes:
 - Next.js API routes using `mysql2` require the **Node.js runtime** (Vercel Serverless Functions support this).
 - Keep `JWT_SECRET` strong and rotate it if leaked.

 ## Security Notes

 - This project uses JWT in localStorage for simplicity.
 - For production-hardening, consider:
   - HTTP-only cookies for tokens
   - CSRF protections (if using cookies)
   - Rate limiting on auth endpoints
   - Input validation (Zod) on API routes

 ## Areas for Improvement (Roadmap)

 - **DX / DevOps**
   - Add DB migrations (Prisma, Drizzle, or Knex)
   - Add `.env.example`
   - Add CI (GitHub Actions) for lint + build

 - **Product**
   - CSV/PDF export from dashboard tables
   - Tags, merchants, payment methods
   - Recurring transactions scheduler
   - Goal tracking (savings goals)

 - **Performance**
   - Server-side aggregation for charts (reduce client filtering work)
   - Pagination on transactions endpoint
   - Caching / memoization for heavy chart transforms

 - **Quality**
   - Unit tests + e2e tests (Vitest/Jest + Playwright)
   - Error boundaries and better empty states

 ## Contributing

 - **Fork** the repo
 - Create a feature branch: `git checkout -b feat/my-feature`
 - Commit: `git commit -m "feat: add ..."`
 - Open a PR

 ## License

 Add a license (MIT recommended) if you plan to open-source publicly.
