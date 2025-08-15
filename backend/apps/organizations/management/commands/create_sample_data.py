from django.core.management.base import BaseCommand
from django.utils import timezone
from datetime import date, timedelta
from apps.organizations.models import Organization
from apps.projects.models import Project
from apps.tasks.models import Task, TaskComment


class Command(BaseCommand):
    help = 'Create sample data for testing'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')

        # Create Organizations
        org1 = Organization.objects.create(
            name='Acme Corporation',
            slug='acme-corp',
            contact_email='admin@acme.com'
        )

        org2 = Organization.objects.create(
            name='Tech Innovations Inc',
            slug='tech-innovations',
            contact_email='contact@techinnovations.com'
        )

        self.stdout.write(f'Created organizations: {org1.name}, {org2.name}')

        # Create Projects for Acme Corporation
        project1 = Project.objects.create(
            organization=org1,
            name='Website Redesign',
            description='Complete redesign of company website with modern UI/UX',
            status='ACTIVE',
            due_date=date.today() + timedelta(days=30)
        )

        project2 = Project.objects.create(
            organization=org1,
            name='Mobile App Development',
            description='Develop a mobile app for customer engagement',
            status='ACTIVE',
            due_date=date.today() + timedelta(days=60)
        )

        project3 = Project.objects.create(
            organization=org1,
            name='Database Migration',
            description='Migrate legacy database to cloud infrastructure',
            status='COMPLETED',
            due_date=date.today() - timedelta(days=10)
        )

        # Create Projects for Tech Innovations
        project4 = Project.objects.create(
            organization=org2,
            name='AI Research Platform',
            description='Build platform for AI/ML research collaboration',
            status='ACTIVE',
            due_date=date.today() + timedelta(days=90)
        )

        self.stdout.write(f'Created {Project.objects.count()} projects')

        # Create Tasks for Website Redesign
        task1 = Task.objects.create(
            project=project1,
            title='Design Homepage Mockup',
            description='Create wireframes and mockups for the new homepage',
            status='DONE',
            priority='HIGH',
            assignee_email='designer@acme.com',
            due_date=timezone.now() + timedelta(days=5)
        )

        task2 = Task.objects.create(
            project=project1,
            title='Implement Responsive Layout',
            description='Code the responsive layout using CSS Grid and Flexbox',
            status='IN_PROGRESS',
            priority='HIGH',
            assignee_email='frontend@acme.com',
            due_date=timezone.now() + timedelta(days=10)
        )

        task3 = Task.objects.create(
            project=project1,
            title='SEO Optimization',
            description='Optimize website for search engines',
            status='TODO',
            priority='MEDIUM',
            assignee_email='seo@acme.com',
            due_date=timezone.now() + timedelta(days=20)
        )

        # Create Tasks for Mobile App
        task4 = Task.objects.create(
            project=project2,
            title='Setup React Native Environment',
            description='Configure development environment for React Native',
            status='DONE',
            priority='HIGH',
            assignee_email='mobile@acme.com',
            due_date=timezone.now() + timedelta(days=3)
        )

        task5 = Task.objects.create(
            project=project2,
            title='Implement User Authentication',
            description='Build login/register functionality',
            status='IN_PROGRESS',
            priority='HIGH',
            assignee_email='mobile@acme.com',
            due_date=timezone.now() + timedelta(days=15)
        )

        # Create Tasks for Database Migration (completed project)
        task6 = Task.objects.create(
            project=project3,
            title='Backup Legacy Database',
            description='Create full backup of current database',
            status='DONE',
            priority='HIGH',
            assignee_email='devops@acme.com',
            due_date=timezone.now() - timedelta(days=20)
        )

        task7 = Task.objects.create(
            project=project3,
            title='Setup Cloud Infrastructure',
            description='Configure AWS RDS instance',
            status='DONE',
            priority='HIGH',
            assignee_email='devops@acme.com',
            due_date=timezone.now() - timedelta(days=15)
        )

        task8 = Task.objects.create(
            project=project3,
            title='Data Migration Script',
            description='Write and test data migration scripts',
            status='DONE',
            priority='MEDIUM',
            assignee_email='backend@acme.com',
            due_date=timezone.now() - timedelta(days=10)
        )

        # Create Tasks for AI Research Platform
        task9 = Task.objects.create(
            project=project4,
            title='Architecture Planning',
            description='Design system architecture for ML platform',
            status='IN_PROGRESS',
            priority='HIGH',
            assignee_email='architect@techinnovations.com',
            due_date=timezone.now() + timedelta(days=7)
        )

        task10 = Task.objects.create(
            project=project4,
            title='Setup Kubernetes Cluster',
            description='Configure K8s cluster for scalable ML workloads',
            status='TODO',
            priority='HIGH',
            assignee_email='devops@techinnovations.com',
            due_date=timezone.now() + timedelta(days=14)
        )

        self.stdout.write(f'Created {Task.objects.count()} tasks')

        # Create Task Comments
        comment1 = TaskComment.objects.create(
            task=task1,
            content='Mockup looks great! The color scheme really works well.',
            author_email='manager@acme.com'
        )

        comment2 = TaskComment.objects.create(
            task=task1,
            content='Updated the navigation based on feedback.',
            author_email='designer@acme.com'
        )

        comment3 = TaskComment.objects.create(
            task=task2,
            content='Need to test on mobile devices before marking complete.',
            author_email='qa@acme.com'
        )

        comment4 = TaskComment.objects.create(
            task=task5,
            content='Authentication flow is working, now testing edge cases.',
            author_email='mobile@acme.com'
        )

        comment5 = TaskComment.objects.create(
            task=task9,
            content='Should we consider using microservices architecture?',
            author_email='senior@techinnovations.com'
        )

        self.stdout.write(f'Created {TaskComment.objects.count()} task comments')

        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created sample data:\n'
                f'- {Organization.objects.count()} organizations\n'
                f'- {Project.objects.count()} projects\n'
                f'- {Task.objects.count()} tasks\n'
                f'- {TaskComment.objects.count()} comments'
            )
        )