import graphene
from graphene_django import DjangoObjectType
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.tasks.models import Task, TaskComment


class OrganizationType(DjangoObjectType):
    project_count = graphene.Int()
    task_count = graphene.Int()

    class Meta:
        model = Organization
        fields = ('id', 'name', 'slug', 'contact_email', 'created_at', 'is_active')
        convert_choices_to_enum = False

    def resolve_project_count(self, info):
        return self.project_count

    def resolve_task_count(self, info):
        return self.task_count


class ProjectType(DjangoObjectType):
    task_count = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()
    is_overdue = graphene.Boolean()

    class Meta:
        model = Project
        fields = ('id', 'name', 'description', 'status', 'due_date', 'created_at', 'updated_at', 'organization')

    def resolve_task_count(self, info):
        return self.task_count

    def resolve_completed_tasks(self, info):
        return self.completed_tasks

    def resolve_completion_rate(self, info):
        return self.completion_rate

    def resolve_is_overdue(self, info):
        return self.is_overdue


class TaskType(DjangoObjectType):
    is_overdue = graphene.Boolean()
    comment_count = graphene.Int()

    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'priority', 'assignee_email', 'due_date', 'created_at', 'updated_at', 'project')

    def resolve_is_overdue(self, info):
        return self.is_overdue

    def resolve_comment_count(self, info):
        return self.comment_count


class TaskCommentType(DjangoObjectType):
    class Meta:
        model = TaskComment
        fields = ('id', 'content', 'author_email', 'created_at', 'updated_at', 'task')


class ProjectStatsType(graphene.ObjectType):
    total_projects = graphene.Int()
    active_projects = graphene.Int()
    completed_projects = graphene.Int()
    total_tasks = graphene.Int()
    completed_tasks = graphene.Int()
    completion_rate = graphene.Float()