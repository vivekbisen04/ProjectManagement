import graphene
from graphene_django.filter import DjangoFilterConnectionField
from django.db.models import Q, Count
from .types import OrganizationType, ProjectType, TaskType, TaskCommentType, ProjectStatsType
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.tasks.models import Task, TaskComment


class Query(graphene.ObjectType):
    organization = graphene.Field(OrganizationType, slug=graphene.String(required=True))
    organizations = graphene.List(OrganizationType)
    
    projects = graphene.List(
        ProjectType,
        status=graphene.String(),
        search=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    project = graphene.Field(ProjectType, id=graphene.ID(required=True))
    
    tasks = graphene.List(
        TaskType,
        project_id=graphene.ID(),
        status=graphene.String(),
        assignee_email=graphene.String(),
        search=graphene.String(),
        limit=graphene.Int(),
        offset=graphene.Int()
    )
    task = graphene.Field(TaskType, id=graphene.ID(required=True))
    
    task_comments = graphene.List(TaskCommentType, task_id=graphene.ID(required=True))
    
    project_stats = graphene.Field(ProjectStatsType)

    def resolve_organization(self, info, slug):
        try:
            return Organization.objects.get(slug=slug, is_active=True)
        except Organization.DoesNotExist:
            return None

    def resolve_organizations(self, info):
        return Organization.objects.filter(is_active=True)

    def resolve_projects(self, info, status=None, search=None, limit=20, offset=0):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return []

        queryset = Project.objects.filter(organization=organization)
        
        if status:
            queryset = queryset.filter(status=status)
        
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset[offset:offset + limit]

    def resolve_project(self, info, id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return None

        try:
            return Project.objects.get(id=id, organization=organization)
        except Project.DoesNotExist:
            return None

    def resolve_tasks(self, info, project_id=None, status=None, assignee_email=None, search=None, limit=20, offset=0):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return []

        queryset = Task.objects.filter(project__organization=organization)
        
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        
        if status:
            queryset = queryset.filter(status=status)
        
        if assignee_email:
            queryset = queryset.filter(assignee_email=assignee_email)
        
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) | Q(description__icontains=search)
            )
        
        return queryset[offset:offset + limit]

    def resolve_task(self, info, id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return None

        try:
            return Task.objects.get(id=id, project__organization=organization)
        except Task.DoesNotExist:
            return None

    def resolve_task_comments(self, info, task_id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return []

        return TaskComment.objects.filter(
            task_id=task_id,
            task__project__organization=organization
        )

    def resolve_project_stats(self, info):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return ProjectStatsType(
                total_projects=0,
                active_projects=0,
                completed_projects=0,
                total_tasks=0,
                completed_tasks=0,
                completion_rate=0.0
            )

        projects = Project.objects.filter(organization=organization)
        total_projects = projects.count()
        active_projects = projects.filter(status='ACTIVE').count()
        completed_projects = projects.filter(status='COMPLETED').count()

        tasks = Task.objects.filter(project__organization=organization)
        total_tasks = tasks.count()
        completed_tasks = tasks.filter(status='DONE').count()
        completion_rate = (completed_tasks / total_tasks * 100) if total_tasks > 0 else 0

        return ProjectStatsType(
            total_projects=total_projects,
            active_projects=active_projects,
            completed_projects=completed_projects,
            total_tasks=total_tasks,
            completed_tasks=completed_tasks,
            completion_rate=round(completion_rate, 2)
        )