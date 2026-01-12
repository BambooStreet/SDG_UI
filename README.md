# SDG_UI

## Setup

### Backend (Python)

1. Create and activate a virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run the API server:

```bash
uvicorn backend.server:app --reload --port 8000
```

### Frontend (Next.js)

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

## Environment

Create `.env.local` in the project root with the required settings:

```bash
DATABASE_URL=postgres://...
GAME_BACKEND_URL=http://127.0.0.1:8000
OPENAI_API_KEY=...
```
