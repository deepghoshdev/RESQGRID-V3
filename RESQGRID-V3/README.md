# RESQGRID V3
A new disaster-management product built from first principles. No V1/V2 implementation was imported. Primary source: [complete master blueprint](docs/master-blueprint.md).

## What works in this build
A React application with Citizen, Rescue Operations, Intelligence, Administration and Recovery workspaces. The **browser-local simulation** supports three-step SOS submission, request tracking, verified/suitable team assignment, conflict checks, response-state transitions, resource release, incident conversations, coordination requests, scenario evidence gates, human warning approval/retraction, sensor/model status, audit entries and reviewed recovery assessments. MapLibre provides a real interactive basemap with explicitly illustrative zones, sensor and shelter points. Four disaster types have distinct navigation/model readiness; no model is represented as trained.

The independent FastAPI service supports validated SOS, idempotency, scoped incident access, assignment/version conflicts, messages, alert drafting/publication, telemetry validation and authenticated WebSocket snapshots. Demo mode uses process-local memory; production selects PostgreSQL and rejects demo tokens. PostgreSQL migrations define PostGIS operational records and location access policies. MongoDB indexes, MQTT ingestion, deduplicated durable jobs, artifact-gated inference, offline training/evaluation and a telemetry simulator are included.

**The review frontend is not connected to the API.** Its changes remain in the same browser. Frontend demo accounts are workspace shortcuts, not security boundaries. The API demo and frontend simulation do not share storage. No actual rescue service is contacted; do not enter real emergency or personal data.

## Run locally
Requires Node 22+, Python 3.12+.

```sh
npm ci
npm run dev
npm run build
npm run test -- --run
python -m venv .venv
.venv/bin/pip install -r backend/requirements.txt
PYTHONPATH=backend:ai/src .venv/bin/uvicorn app.main:app --port 8000
PYTHONPATH=backend:ai/src .venv/bin/pytest tests/backend -q
python iot/simulator/telemetry.py --help
```

Copy `.env.example` to `.env` locally. API docs: `/docs`, health: `/api/v1/health`. Demo API bearer tokens: `demo-citizen`, `demo-other`, `demo-agency`, `demo-intelligence`, `demo-admin`; **production rejects these**. Production refuses missing required configuration. Do not enable demo mode on a live operational service.

## Not completed or accepted for production
Supabase account creation/session UI, live frontend API/reconnect adapter, real geolocation and permission/fallback flow, private photo uploads, agency onboarding/verification endpoints, live recovery/coordination endpoints, alert delivery providers/receipts, authenticated telemetry subscriber deployment, physical sensor adapters/calibration, deployed database policy verification, trained hazard artifacts, authority-reviewed risk thresholds, trusted GIS/resource data, load/accessibility/security acceptance, observability, backups and restore drills. Exported schemas and deployment files are starting points, not proof of live deployment. The API health endpoint checks process readiness only, not dependency health.

## Structure
- `frontend/`: fresh React/Vite interface, domain simulation, maps, charts, optional agent tools.
- `backend/`: FastAPI contracts, identity, domain repositories, risk/inference and MQTT worker.
- `database/`: fresh PostgreSQL migrations and MongoDB indexes.
- `ai/`: independent training/evaluation/artifact verification, hazard configuration, empty dataset manifest.
- `iot/`: schema-valid simulator and ESP32 health starter.
- `tests/`: frontend domain/UI, backend safeguards and browser workflows.
- `docs/`: preserved blueprint, architecture, contracts, design and acceptance backlog.
- `deploy/`, `render.yaml`, `netlify.toml`, `.github/`: deployment and CI templates.

See [architecture and boundaries](docs/architecture.md), [remaining acceptance work](docs/implementation-status.md), [security](docs/security.md), [deployment](docs/deployment.md), [AI policy](docs/ai.md) and [hardware commissioning](iot/README.md).
