import pytest
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.tasks.models import Task, TaskComment


class OrganizationModelTest(TestCase):
    def test_organization_creation(self):
        org = Organization.objects.create(
            name="Test Org",
            contact_email="test@example.com"
        )
        self.assertEqual(org.slug, "test-org")
        self.assertTrue(org.is_active)
        
    def test_organization_str(self):
        org = Organization.objects.create(
            name="Test Organization",
            contact_email="test@example.com"
        )
        self.assertEqual(str(org), "Test Organization")


class ProjectModelTest(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(
            name="Test Org",
            contact_email="test@example.com"
        )
    
    def test_project_creation(self):
        project = Project.objects.create(
            organization=self.organization,
            name="Test Project",
            description="Test Description"
        )
        self.assertEqual(project.status, "ACTIVE")
        self.assertEqual(project.task_count, 0)
        self.assertEqual(project.completion_rate, 0)
    
    def test_project_str(self):
        project = Project.objects.create(
            organization=self.organization,
            name="Test Project"
        )
        self.assertEqual(str(project), "Test Org - Test Project")


class TaskModelTest(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(
            name="Test Org",
            contact_email="test@example.com"
        )
        self.project = Project.objects.create(
            organization=self.organization,
            name="Test Project"
        )
    
    def test_task_creation(self):
        task = Task.objects.create(
            project=self.project,
            title="Test Task",
            description="Test Description"
        )
        self.assertEqual(task.status, "TODO")
        self.assertEqual(task.priority, "MEDIUM")
        self.assertEqual(task.comment_count, 0)
    
    def test_task_str(self):
        task = Task.objects.create(
            project=self.project,
            title="Test Task"
        )
        self.assertEqual(str(task), "Test Project - Test Task")


class TaskCommentModelTest(TestCase):
    def setUp(self):
        self.organization = Organization.objects.create(
            name="Test Org",
            contact_email="test@example.com"
        )
        self.project = Project.objects.create(
            organization=self.organization,
            name="Test Project"
        )
        self.task = Task.objects.create(
            project=self.project,
            title="Test Task"
        )
    
    def test_comment_creation(self):
        comment = TaskComment.objects.create(
            task=self.task,
            content="Test comment",
            author_email="author@example.com"
        )
        self.assertEqual(comment.content, "Test comment")
        self.assertEqual(self.task.comment_count, 1)