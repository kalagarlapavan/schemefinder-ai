# SchemeFinder AI

> **IDEA//FORGE Hackathon · Civic Pulse Track — Digital Governance & Public Information**

SchemeFinder AI helps Indian citizens discover government schemes they may be eligible for. Enter basic profile details → AI-powered eligibility matching → View schemes, benefits, documents, and official application links.

---

## Features

| Feature | Status |
|---|---|
| Homepage with scheme overview | ✅ |
| Browse & Search all schemes | ✅ |
| Rule-based Eligibility Checker | ✅ |
| AI Assistant (Gemini) | ✅ |
| Scheme Details page | ✅ |
| Supabase PostgreSQL database | ✅ |
| 12 sample scheme records included in seed data | ✅ |

---

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API (Gemini 3.8 Flash)
- **Deployment**: Vercel (frontend) + Render (backend)

---

## Project Structure

```
schemefinder-ai/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/   # Navbar, Footer, SchemeCard
│   │   ├── pages/        # Home, FindSchemes, EligibilityChecker, AIAssistant, SchemeDetail
│   │   └── services/     # api.ts (Axios client)
│   └── .env.example
├── backend/           # FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── database.py
│   │   ├── routes/       # health, schemes, eligibility, assistant
│   │   └── eligibility/  # checker.py (rule engine)
│   └── .env.example
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

---

## Setup Instructions

### Prerequisites

- **Python 3.12** (required — pydantic-core has no wheel for 3.14 yet)
  - Check: `py --list` → you need `-V:3.12` in the list
- Node.js 18+
- A Supabase account (free tier works): https://supabase.com
- A Google Gemini API key (free): https://aistudio.google.com

---

### Step 1: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** in your Supabase dashboard
3. Run `database/schema.sql` to create the tables
4. Run `database/seed.sql` to insert 12 government schemes
5. Go to **Settings → API** and copy:
   - **Project URL** (e.g., `https://abc.supabase.co`)
   - **Secret key** for server-side backend use (never expose it in frontend code or a `VITE_` variable)

---

### Step 2: Configure Backend

```powershell
cd backend
copy .env.example .env
```

Edit `backend/.env`:
```
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-public-key
GEMINI_API_KEY=your-gemini-api-key
CORS_ORIGINS=http://localhost:5173
```

---

### Step 3: Start the Backend

```powershell
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

API Docs will be available at: http://localhost:8000/docs

---

### Step 4: Configure Frontend

```powershell
cd frontend
copy .env.example .env
```

The `.env` file already has:
```
VITE_API_BASE_URL=http://localhost:8000
```

---

### Step 5: Start the Frontend

```powershell
cd frontend
npm install
npm run dev
```

Frontend will be at: http://localhost:5173

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/schemes` | List all schemes (supports `?search=` and `?category=`) |
| GET | `/api/schemes/{id}` | Get single scheme by ID |
| GET | `/api/schemes/categories` | Get all scheme categories |
| POST | `/api/eligibility/check` | Rule-based eligibility check |
| POST | `/api/assistant/chat` | Gemini AI chat |

### POST /api/eligibility/check

```json
{
  "age": 22,
  "state": "Kerala",
  "occupation": "Student",
  "annual_income": 150000,
  "education": "Graduate"
}
```

---

## Testing

### Manual Test Cases

| Test | Profile | Expected Result |
|---|---|---|
| Student scholarships | Age 20, Student, Income 1.5L, Graduate | CSSS Scholarship eligible |
| Farmer schemes | Age 40, Farmer, Income 1.2L | PM-KISAN, KCC eligible |
| Senior citizen | Age 70, Retired, Income 60K | NOAPS, Ayushman senior |
| Business schemes | Age 35, Business Owner, Income 8L | Mudra Yojana eligible |
| High income | Age 30, Salaried, Income 25L | Most income-restricted schemes NOT eligible |

### Search Test
- Search "KISAN" → PM-KISAN shows up
- Filter category "Education" → Only scholarship schemes shown

---

## Deployment on Vercel

This repository is configured as a Vercel multi-service project:

- **Frontend service**: `frontend/` (Vite)
- **Backend service**: `backend/` (FastAPI)
- **API routing**: requests under `/api/*` are routed to the backend; other paths go to the frontend.

### Vercel setup

1. Import this GitHub repository into Vercel.
2. In **Settings → Build and Deployment**, set the project framework to **Services**.
3. Confirm the root `vercel.json` file is included in the deployment.
4. Add these environment variables to the backend service (or the project environment if Vercel applies them to all services):
   - `SUPABASE_URL`: Supabase Project URL, without `/rest/v1/`.
   - `SUPABASE_KEY`: Supabase server-side key. Keep it private; never use it in a `VITE_*` variable.
   - `GEMINI_API_KEY`: Google AI Studio API key. Keep it private.
5. Enable the Production environment (and Preview if you want preview deployments).
6. Redeploy after changing environment variables or code.

The frontend uses same-origin `/api` requests in production, so a separate `VITE_API_BASE_URL` is not required for this Vercel setup.

### Supabase database setup

Before testing scheme browsing or eligibility:

1. Open the Supabase project **SQL Editor**.
2. Run `database/schema.sql` once to create the tables.
3. Run `database/seed.sql` to insert the sample scheme records.
4. Open the deployed website and test the scheme list, search, eligibility checker, and AI assistant.

Do not run the seed script repeatedly unless you intend to add duplicate sample rows.

## Government Schemes in Database

1. PM-KISAN Samman Nidhi — Agriculture
2. Ayushman Bharat PM-JAY — Health
3. PMAY Urban Housing — Housing
4. Central Sector Scholarship (CSSS) — Education
5. Post-Matric Scholarship for SC — Education
6. PM Mudra Yojana — Business
7. Sukanya Samriddhi Yojana — Women & Child
8. National Old Age Pension (NOAPS) — Social Welfare
9. PM SVANidhi Street Vendor Loan — Business
10. Kisan Credit Card (KCC) — Agriculture
11. National Apprenticeship Promotion — Skill Development
12. Startup India Seed Fund — Business

---

## Data Sources

The seed data contains example scheme information with source links. Scheme rules, benefits, amounts, deadlines, and application processes can change. Verify each detail on the relevant official government portal before relying on it:
- https://www.myscheme.gov.in
- https://www.india.gov.in
- https://scholarships.gov.in
- https://pmkisan.gov.in
- https://pmjay.gov.in
- https://pmaymis.gov.in
- https://www.mudra.org.in
- https://nsap.nic.in
- https://pmsvanidhi.mohua.gov.in

---

## Disclaimer

SchemeFinder AI provides indicative information for discovery and education only. The sample scheme records may not reflect the latest rules or benefit amounts. Final eligibility is determined only by the relevant government department. Always verify current criteria, benefits, deadlines, and application instructions on official government websites before applying.
