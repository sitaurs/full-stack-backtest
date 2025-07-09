# Full Stack Backtest

This project provides a small full-stack application for backtesting forex strategies with Node.js and a React dashboard.

## Setup
1. `npm install` in the project root.
2. Copy `.env.example` to `.env` and fill in your Gemini API key.
3. `npm run build` to compile the backend.
4. `node dist/server.js` to start the API server.
5. In `frontend` run `npm install` and `npm run dev` to start the dashboard.

The server exposes:
- `POST /api/backtest/run` to start a backtest
- `GET /api/reports` to list reports
- `GET /api/reports/:id` to fetch a report
- `POST /api/reports/:id/evaluate` to get Gemini evaluation

Backtest results are stored under `reports/` as JSON.
