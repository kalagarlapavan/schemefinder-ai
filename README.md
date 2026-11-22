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
| 12 verified government schemes | ✅ |

---

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Python FastAPI
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini 1.5 Flash
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
   - **anon public key**

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

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import repo in Vercel
3. Set `VITE_API_BASE_URL=https://your-render-backend.onrender.com` in Vercel env vars
4. Deploy

### Backend (Render)
1. Create new **Web Service** on Render
2. Connect GitHub repo, set root directory to `backend/`
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add all env vars from `.env.example`

---

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

All scheme data sourced from official government portals:
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

SchemeFinder AI provides indicative information only. Final eligibility is determined by the relevant government department. Always verify details at official government websites before applying.
