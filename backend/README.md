# Mini Project Management System - Backend

A multi-tenant project management system built with Django and GraphQL, featuring organization-based data isolation and a comprehensive API for managing projects and tasks.

## 🚀 Features

- **Multi-tenant Architecture**: Organization-based data isolation
- **GraphQL API**: Comprehensive queries and mutations
- **Django Models**: Organization, Project, Task, and TaskComment entities
- **Real-time Statistics**: Project completion rates and task analytics
- **RESTful Health Check**: Basic API health monitoring
- **Comprehensive Testing**: Unit tests for models and GraphQL endpoints

## 🛠 Tech Stack

- **Backend**: Django 4.2.7
- **API**: GraphQL (Graphene-Django 3.1.5)
- **Database**: PostgreSQL
- **Testing**: Pytest with Django integration
- **Additional**: Django REST Framework, CORS headers

## 📋 Prerequisites

- Python 3.8+
- PostgreSQL 12+
- pip (Python package manager)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd backend
```

### 2. Create Virtual Environment
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DB_NAME=project_management
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 5. Database Setup
```bash
# Create PostgreSQL database
createdb project_management

# Run migrations
python manage.py makemigrations
python manage.py migrate

# Create superuser (optional)
python manage.py createsuperuser
```

### 6. Run Development Server
```bash
python manage.py runserver
```

The API will be available at:
- GraphQL Playground: `http://localhost:8000/graphql/`
- Admin Panel: `http://localhost:8000/admin/`
- Health Check: `http://localhost:8000/api/health/`

## 📊 Data Models

### Organization
- Multi-tenant base entity
- Fields: name, slug, contact_email, is_active
- Auto-generates slug from name
- Properties: project_count, task_count

### Project
- Organization-dependent entity
- Fields: name, description, status, due_date
- Status choices: ACTIVE, COMPLETED, ON_HOLD, ARCHIVED
- Properties: task_count, completed_tasks, completion_rate, is_overdue

### Task
- Project-dependent entity
- Fields: title, description, status, priority, assignee_email, due_date
- Status choices: TODO, IN_PROGRESS, DONE, BLOCKED
- Priority choices: LOW, MEDIUM, HIGH, URGENT
- Properties: is_overdue, comment_count

### TaskComment
- Task-dependent entity
- Fields: content, author_email, timestamp
- Linked to specific tasks for communication

## 🔌 GraphQL API

### Authentication & Multi-tenancy
Include organization slug in request headers:
```
X-Organization-Slug: your-organization-slug
```

### Sample Queries

#### List Projects
```graphql
query {
  projects(status: "ACTIVE", limit: 10) {
    id
    name
    description
    status
    taskCount
    completionRate
    dueDate
  }
}
```

#### Get Project Statistics
```graphql
query {
  projectStats {
    totalProjects
    activeProjects
    completedProjects
    totalTasks
    completedTasks
    completionRate
  }
}
```

#### List Tasks
```graphql
query {
  tasks(projectId: "1", status: "TODO") {
    id
    title
    description
    status
    priority
    assigneeEmail
    dueDate
    isOverdue
  }
}
```

### Sample Mutations

#### Create Project
```graphql
mutation {
  createProject(
    name: "New Project"
    description: "Project description"
    status: "ACTIVE"
    dueDate: "2024-12-31"
  ) {
    project {
      id
      name
      status
    }
    success
    errors
  }
}
```

#### Create Task
```graphql
mutation {
  createTask(
    projectId: "1"
    title: "New Task"
    description: "Task description"
    priority: "HIGH"
    assigneeEmail: "user@example.com"
  ) {
    task {
      id
      title
      status
      priority
    }
    success
    errors
  }
}
```

#### Update Task Status
```graphql
mutation {
  updateTask(id: "1", status: "DONE") {
    task {
      id
      status
    }
    success
    errors
  }
}
```

#### Add Task Comment
```graphql
mutation {
  createTaskComment(
    taskId: "1"
    content: "Great progress on this task!"
    authorEmail: "manager@example.com"
  ) {
    comment {
      id
      content
      authorEmail
      createdAt
    }
    success
    errors
  }
}
```

## 🧪 Testing

### Run All Tests
```bash
pytest
```

### Run Specific Test Categories
```bash
# Model tests only
pytest tests/test_models.py

# GraphQL tests only
pytest tests/test_graphql.py

# With coverage
pytest --cov=apps
```

### Test Structure
- `tests/test_models.py`: Unit tests for Django models
- `tests/test_graphql.py`: Integration tests for GraphQL API
- Uses Factory Boy for test data generation
- Coverage reporting included

## 🛡️ Multi-tenancy Implementation

### Organization Middleware
- `apps.core.middleware.OrganizationMiddleware`
- Extracts organization from `X-Organization-Slug` header
- Attaches organization to request object
- Returns error for invalid organization

### Data Isolation
- All queries filtered by organization context
- Mutations validate organization ownership
- No cross-organization data access possible

## 📁 Project Structure

```
backend/
├── project_management/          # Django project settings
│   ├── settings.py             # Main configuration
│   ├── urls.py                 # URL routing
│   └── wsgi.py                 # WSGI configuration
├── apps/
│   ├── organizations/          # Organization model & admin
│   ├── projects/              # Project model & admin
│   ├── tasks/                 # Task & Comment models
│   ├── core/                  # Middleware & utilities
│   ├── schema/                # GraphQL schema definition
│   └── api/                   # REST API endpoints
├── tests/                     # Test suite
├── requirements.txt           # Python dependencies
├── .env.example              # Environment template
└── manage.py                 # Django management script
```

## 🔧 Configuration

### Django Settings
- Multi-app structure with clear separation
- PostgreSQL database configuration
- GraphQL endpoint at `/graphql/`
- CORS headers for frontend integration
- Comprehensive logging setup

### Environment Variables
See `.env.example` for all configurable options:
- Database connection settings
- Debug mode toggle
- CORS origins configuration
- Secret key management

## 🚀 Deployment Notes

### Production Checklist
1. Set `DEBUG=False` in environment
2. Configure proper `SECRET_KEY`
3. Set up PostgreSQL database
4. Configure `ALLOWED_HOSTS`
5. Set up proper CORS origins
6. Configure static file serving
7. Set up database migrations in deployment pipeline

### Docker Support (Optional)
Basic Docker configuration can be added for containerized deployment.

## 📈 Performance Considerations

### Database Optimization
- Proper indexing on frequently queried fields
- Database relationships optimized for queries
- Pagination implemented in GraphQL queries

### GraphQL Optimization
- Uses `graphene-django-optimizer` for N+1 query prevention
- Efficient field resolution
- Proper error handling and validation

## 🤝 Frontend Integration

### CORS Configuration
Backend configured to accept requests from:
- `http://localhost:3000` (React development)
- `http://127.0.0.1:3000`

### Required Headers
```javascript
// Example frontend request
headers: {
  'Content-Type': 'application/json',
  'X-Organization-Slug': 'your-organization-slug'
}
```

## 📝 API Documentation

### GraphQL Schema Introspection
Visit `http://localhost:8000/graphql/` for interactive GraphQL playground with:
- Schema exploration
- Query testing
- Mutation testing
- Documentation browser

### REST Endpoints
- `GET /api/health/` - Health check endpoint
- GraphQL endpoint handles all data operations

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
- Verify PostgreSQL is running
- Check database credentials in `.env`
- Ensure database exists

**Organization Not Found**
- Verify `X-Organization-Slug` header is included
- Check organization exists and is active
- Confirm slug format (lowercase, hyphenated)

**GraphQL Errors**
- Check GraphQL playground for syntax errors
- Verify required arguments are provided
- Ensure proper organization context

## 📄 License

This project is part of a technical assessment and is for demonstration purposes.

## 🔮 Future Enhancements

- Real-time subscriptions with GraphQL
- Advanced task filtering and search
- File attachments for tasks
- User authentication and permissions
- Email notifications
- Task time tracking
- Project templates
- Advanced analytics and reporting