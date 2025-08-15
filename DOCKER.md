# Docker Backend Setup Guide

This project uses Docker only for backend services (database + API). Frontend runs locally to avoid container freezing issues.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ for frontend
- At least 2GB RAM available

## Quick Start

```bash
# Terminal 1: Start backend services
docker-compose -f docker-compose.dev.yml up --build

# Terminal 2: Start frontend locally
cd frontend
npm install
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# GraphQL: http://localhost:8000/graphql/
# Database: localhost:5433
```

## Project Structure

```
project/
├── backend/
│   └── Dockerfile.dev     # Backend development image
├── frontend/
│   └── Dockerfile.dev     # Frontend development image  
└── docker-compose.dev.yml # Development orchestration
```

## Services

### Development Services
- **db**: PostgreSQL 15 database on port 5433
- **backend**: Django development server on port 8000 (with hot reload)
- **frontend-dev**: React development server on port 3000 (with hot reload)

## Environment Variables

### Backend
- `DEBUG=True` - Development mode
- `DB_NAME=project_management` - Database name
- `DB_USER=postgres` - Database user
- `DB_PASSWORD=postgres` - Database password
- `CORS_ALLOW_ALL_ORIGINS=True` - Allow all origins for development

### Frontend
- `CHOKIDAR_USEPOLLING=true` - Use polling for file changes (prevents Docker issues)
- `CHOKIDAR_INTERVAL=1000` - Polling interval in milliseconds
- `REACT_APP_API_URL=http://localhost:8000` - Backend API URL
- `REACT_APP_GRAPHQL_URL=http://localhost:8000/graphql/` - GraphQL endpoint

## Useful Commands

### Development
```bash
# Start services
docker-compose -f docker-compose.dev.yml up --build

# Start in background
docker-compose -f docker-compose.dev.yml up -d

# Stop services
docker-compose -f docker-compose.dev.yml down

# View logs
docker-compose -f docker-compose.dev.yml logs -f

# View specific service logs
docker-compose -f docker-compose.dev.yml logs -f backend
```

### Database Operations
```bash
# Run Django migrations
docker-compose -f docker-compose.dev.yml exec backend python manage.py migrate

# Create sample data
docker-compose -f docker-compose.dev.yml exec backend python manage.py create_sample_data

# Access database shell
docker-compose -f docker-compose.dev.yml exec db psql -U postgres -d project_management
```

### Container Management
```bash
# Execute commands in containers
docker-compose -f docker-compose.dev.yml exec backend bash
docker-compose -f docker-compose.dev.yml exec frontend-dev sh

# Rebuild specific service
docker-compose -f docker-compose.dev.yml build backend
```

## Data Persistence

- Database data is persisted in `postgres_data` volume
- Frontend `node_modules` is stored in `frontend_node_modules` volume
- Source code changes are reflected immediately via bind mounts

## Troubleshooting

### Container Won't Stop
If frontend container gets stuck (common with file watchers):
```bash
# Force stop containers
docker kill $(docker ps -q)

# Clean up
docker-compose -f docker-compose.dev.yml down --remove-orphans
```

### Reset Everything
```bash
# Stop and remove all containers/volumes
docker-compose -f docker-compose.dev.yml down -v

# Remove all images
docker-compose -f docker-compose.dev.yml down --rmi all

# Rebuild from scratch
docker-compose -f docker-compose.dev.yml up --build
```

### File Watching Issues
The setup uses polling instead of native file watching to prevent Docker filesystem conflicts:
- `CHOKIDAR_USEPOLLING=true` - Enables polling mode
- `CHOKIDAR_INTERVAL=1000` - Checks for changes every second

If you experience high CPU usage, increase the interval or run the frontend locally:

```bash
# Run frontend locally instead of in Docker
cd frontend
npm install
npm run dev

# Keep backend in Docker
docker-compose -f docker-compose.dev.yml up backend db
```

## Alternative Setup

For better performance, you can run frontend locally and only backend in Docker:

```bash
# Terminal 1: Start backend services
docker-compose -f docker-compose.dev.yml up backend db

# Terminal 2: Run frontend locally
cd frontend
npm install
npm run dev
```

This avoids Docker file watching issues while maintaining database isolation.