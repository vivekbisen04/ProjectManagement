import pytest
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.tasks.models import Task


class GraphQLTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.organization = Organization.objects.create(
            name="Test Organization",
            contact_email="test@example.com"
        )
        
    def _graphql_query(self, query, variables=None):
        body = {'query': query}
        if variables:
            body['variables'] = variables
        
        return self.client.post(
            '/graphql/',
            body,
            content_type='application/json',
            HTTP_X_ORGANIZATION_SLUG=self.organization.slug
        )

    def test_projects_query(self):
        Project.objects.create(
            organization=self.organization,
            name="Test Project",
            description="Test Description"
        )
        
        query = '''
        query {
            projects {
                id
                name
                description
                status
                taskCount
            }
        }
        '''
        
        response = self._graphql_query(query)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('data', data)
        self.assertIn('projects', data['data'])
        self.assertEqual(len(data['data']['projects']), 1)

    def test_project_stats_query(self):
        project = Project.objects.create(
            organization=self.organization,
            name="Test Project"
        )
        Task.objects.create(
            project=project,
            title="Test Task",
            status="DONE"
        )
        
        query = '''
        query {
            projectStats {
                totalProjects
                activeProjects
                totalTasks
                completedTasks
                completionRate
            }
        }
        '''
        
        response = self._graphql_query(query)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        stats = data['data']['projectStats']
        self.assertEqual(stats['totalProjects'], 1)
        self.assertEqual(stats['totalTasks'], 1)
        self.assertEqual(stats['completedTasks'], 1)
        self.assertEqual(stats['completionRate'], 100.0)

    def test_create_project_mutation(self):
        mutation = '''
        mutation {
            createProject(name: "New Project", description: "New Description") {
                project {
                    id
                    name
                    description
                }
                success
                errors
            }
        }
        '''
        
        response = self._graphql_query(mutation)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        result = data['data']['createProject']
        self.assertTrue(result['success'])
        self.assertEqual(result['project']['name'], "New Project")