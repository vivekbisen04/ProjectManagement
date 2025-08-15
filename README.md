# Project Management System

A full-stack project management application built with Django GraphQL backend and React TypeScript frontend, featuring multi-tenant architecture with organization-based data isolation.

## 🚀 Features

- **Multi-tenant Organization System**: Complete organization-based data isolation
- **Project Management**: Create, read, update, and delete projects
- **Task Management**: Comprehensive task tracking with status management
- **Real-time GraphQL API**: Efficient data fetching with GraphQL
- **Responsive Design**: Modern UI built with React and TailwindCSS
- **Delete Functionality**: Remove projects and tasks with confirmation dialogs
- **Docker Support**: Complete containerization for development

## 🛠 Tech Stack

### Backend
- **Django 4.2.7**: Python web framework
- **GraphQL (Graphene)**: API query language
- **PostgreSQL**: Primary database

### Frontend
- **React 18+**: JavaScript library for UI
- **TypeScript**: Type-safe JavaScript
- **Apollo Client**: GraphQL client
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## 📁 Project Structure

```
project/
├── backend/                 # Django backend
│   ├── apps/               # Django applications
│   │   ├── organizations/  # Organization management
│   │   ├── projects/       # Project management
│   │   ├── tasks/          # Task management
│   │   └── schema/         # GraphQL schema
│   ├── project_management/ # Django settings
│   └── requirements.txt    # Python dependencies
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── graphql/        # GraphQL queries/mutations
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   ├── Dockerfile.dev      # Frontend development container
│   └── package.json        # Node.js dependencies
├── docker-compose.dev.yml  # Development setup
└── DOCKER.md              # Detailed Docker guide
```

## 🐳 Quick Start (Recommended)

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ for frontend
- At least 2GB RAM available

### Development Environment
```bash
# Clone the repository
git clone https://github.com/vivekbisen04/ProjectManagement.git
cd project

# Start backend services (database + API)
docker-compose -f docker-compose.dev.yml up --build

# In another terminal, start frontend locally
cd frontend
npm install
npm run dev

# Access the application
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
# GraphQL: http://localhost:8000/graphql/
```

## 💻 Manual Setup (Without Docker)

### Prerequisites
- Python 3.12+
- Node.js 18+
- PostgreSQL 15+
- Git

### Backend Setup

1. **Create and activate virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
Create `.env` file in backend directory:
```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_NAME=project_management
DB_USER=postgres
DB_PASSWORD=your-password
DB_HOST=localhost
DB_PORT=5432
CORS_ALLOW_ALL_ORIGINS=True
```

4. **Set up database:**
```bash
# Create PostgreSQL database
createdb project_management

# Run migrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

5. **Start backend server:**
```bash
python manage.py runserver
```

Backend will be available at: http://localhost:8000

### Frontend Setup

1. **Install dependencies:**
```bash
cd frontend
npm install
```

2. **Set up environment variables:**
Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_GRAPHQL_URL=http://localhost:8000/graphql/
```

3. **Start development server:**
```bash
npm run dev
```

Frontend will be available at: http://localhost:5173

## 🔧 Available Scripts

### Backend
```bash
python manage.py migrate        # Run database migrations
python manage.py runserver      # Start development server
python manage.py test          # Run tests
python manage.py collectstatic # Collect static files
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### Docker
```bash
# Development
docker-compose -f docker-compose.dev.yml up --build
docker-compose -f docker-compose.dev.yml down

# Production
docker-compose up --build -d
docker-compose down

# View logs
docker-compose logs -f [service-name]
```

## 🌐 API Endpoints

### GraphQL Endpoint
- **URL**: `http://localhost:8000/graphql/`
- **Playground**: Available in development mode

### Key GraphQL Operations

**Queries:**
- `organizations`: List organizations
- `projects`: List projects for current organization
- `tasks`: List tasks for a project

**Mutations:**
- `createProject`: Create new project
- `updateProject`: Update existing project
- `deleteProject`: Delete project
- `createTask`: Create new task
- `updateTask`: Update existing task
- `deleteTask`: Delete task

## 🔒 Authentication & Authorization

- Multi-tenant architecture with organization-based data isolation
- All data operations are scoped to the current organization
- Middleware ensures users can only access their organization's data

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

## 📊 Database Schema

### Core Models
- **Organization**: Multi-tenant isolation
- **Project**: Project management with organization scope
- **Task**: Task tracking linked to projects
- **User**: Django's built-in user model

## 🚀 Deployment

### Production Considerations
1. Set `DEBUG=False` in backend
2. Configure proper database credentials
3. Set up SSL/HTTPS
4. Configure proper CORS origins
5. Set up static file serving
6. Configure logging and monitoring

### Environment Variables
Key production environment variables:
- `SECRET_KEY`: Strong Django secret key
- `DEBUG`: Set to `False`
- `ALLOWED_HOSTS`: Comma-separated allowed hosts
- `DB_*`: Database configuration
- `CORS_ALLOWED_ORIGINS`: Specific frontend origins

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS settings allow frontend origin
2. **Database Connection**: Verify PostgreSQL is running and credentials are correct
3. **Port Conflicts**: Check if ports 3000, 8000, 5432 are available
4. **Docker Issues**: Try `docker system prune -f` to clean up

### Debug Commands
```bash
# Check running containers
docker ps

# View logs
docker logs <container-name>

# Execute commands in container
docker exec -it <container-name> bash

# Check database connection
docker exec -it myproject-db-1 psql -U postgres -d project_management
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Docker setup guide in `DOCKER.md`
3. Open an issue on GitHub

## 🔄 Version History

- **v1.0.0**: Initial release with basic project and task management
- **v1.1.0**: Added delete functionality with confirmation dialogs
- **v1.2.0**: Complete Docker containerization support