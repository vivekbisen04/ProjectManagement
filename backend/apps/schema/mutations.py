import graphene
from django.utils import timezone
from .types import OrganizationType, ProjectType, TaskType, TaskCommentType
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.tasks.models import Task, TaskComment


class CreateOrganization(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        contact_email = graphene.String(required=True)

    organization = graphene.Field(OrganizationType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, name, contact_email):
        try:
            organization = Organization.objects.create(
                name=name,
                contact_email=contact_email
            )
            return CreateOrganization(organization=organization, success=True, errors=[])
        except Exception as e:
            return CreateOrganization(organization=None, success=False, errors=[str(e)])


class CreateProject(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, name, description='', status='ACTIVE', due_date=None):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return CreateProject(project=None, success=False, errors=['Organization required'])

        try:
            project = Project.objects.create(
                organization=organization,
                name=name,
                description=description,
                status=status,
                due_date=due_date
            )
            return CreateProject(project=project, success=True, errors=[])
        except Exception as e:
            return CreateProject(project=None, success=False, errors=[str(e)])


class UpdateProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()
        status = graphene.String()
        due_date = graphene.Date()

    project = graphene.Field(ProjectType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, **kwargs):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return UpdateProject(project=None, success=False, errors=['Organization required'])

        try:
            project = Project.objects.get(id=id, organization=organization)
            
            for field, value in kwargs.items():
                if value is not None:
                    setattr(project, field, value)
            
            project.save()
            return UpdateProject(project=project, success=True, errors=[])
        except Project.DoesNotExist:
            return UpdateProject(project=None, success=False, errors=['Project not found'])
        except Exception as e:
            return UpdateProject(project=None, success=False, errors=[str(e)])


class CreateTask(graphene.Mutation):
    class Arguments:
        project_id = graphene.ID(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        status = graphene.String()
        priority = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, project_id, title, description='', status='TODO', priority='MEDIUM', assignee_email='', due_date=None):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return CreateTask(task=None, success=False, errors=['Organization required'])

        try:
            project = Project.objects.get(id=project_id, organization=organization)
            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                status=status,
                priority=priority,
                assignee_email=assignee_email,
                due_date=due_date
            )
            return CreateTask(task=task, success=True, errors=[])
        except Project.DoesNotExist:
            return CreateTask(task=None, success=False, errors=['Project not found'])
        except Exception as e:
            return CreateTask(task=None, success=False, errors=[str(e)])


class UpdateTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        title = graphene.String()
        description = graphene.String()
        status = graphene.String()
        priority = graphene.String()
        assignee_email = graphene.String()
        due_date = graphene.DateTime()

    task = graphene.Field(TaskType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id, **kwargs):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return UpdateTask(task=None, success=False, errors=['Organization required'])

        try:
            task = Task.objects.get(id=id, project__organization=organization)
            
            for field, value in kwargs.items():
                if value is not None:
                    setattr(task, field, value)
            
            task.save()
            return UpdateTask(task=task, success=True, errors=[])
        except Task.DoesNotExist:
            return UpdateTask(task=None, success=False, errors=['Task not found'])
        except Exception as e:
            return UpdateTask(task=None, success=False, errors=[str(e)])


class CreateTaskComment(graphene.Mutation):
    class Arguments:
        task_id = graphene.ID(required=True)
        content = graphene.String(required=True)
        author_email = graphene.String(required=True)

    comment = graphene.Field(TaskCommentType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, task_id, content, author_email):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return CreateTaskComment(comment=None, success=False, errors=['Organization required'])

        try:
            task = Task.objects.get(id=task_id, project__organization=organization)
            comment = TaskComment.objects.create(
                task=task,
                content=content,
                author_email=author_email
            )
            return CreateTaskComment(comment=comment, success=True, errors=[])
        except Task.DoesNotExist:
            return CreateTaskComment(comment=None, success=False, errors=['Task not found'])
        except Exception as e:
            return CreateTaskComment(comment=None, success=False, errors=[str(e)])


class DeleteProject(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return DeleteProject(success=False, errors=['Organization required'])

        try:
            project = Project.objects.get(id=id, organization=organization)
            project.delete()
            return DeleteProject(success=True, errors=[])
        except Project.DoesNotExist:
            return DeleteProject(success=False, errors=['Project not found'])
        except Exception as e:
            return DeleteProject(success=False, errors=[str(e)])


class DeleteTask(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, id):
        organization = getattr(info.context, 'organization', None)
        if not organization:
            return DeleteTask(success=False, errors=['Organization required'])

        try:
            task = Task.objects.get(id=id, project__organization=organization)
            task.delete()
            return DeleteTask(success=True, errors=[])
        except Task.DoesNotExist:
            return DeleteTask(success=False, errors=['Task not found'])
        except Exception as e:
            return DeleteTask(success=False, errors=[str(e)])


class Mutation(graphene.ObjectType):
    create_organization = CreateOrganization.Field()
    create_project = CreateProject.Field()
    update_project = UpdateProject.Field()
    delete_project = DeleteProject.Field()
    create_task = CreateTask.Field()
    update_task = UpdateTask.Field()
    delete_task = DeleteTask.Field()
    create_task_comment = CreateTaskComment.Field()