from django.db import models
from django.core.validators import EmailValidator
from apps.projects.models import Project


class Task(models.Model):
    STATUS_CHOICES = [
        ('TODO', 'To Do'),
        ('IN_PROGRESS', 'In Progress'),
        ('DONE', 'Done'),
        ('BLOCKED', 'Blocked'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    project = models.ForeignKey(
        Project, 
        on_delete=models.CASCADE, 
        related_name='tasks'
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TODO')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    assignee_email = models.EmailField(blank=True, validators=[EmailValidator()])
    due_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'tasks'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['project', 'status']),
            models.Index(fields=['assignee_email']),
            models.Index(fields=['due_date']),
            models.Index(fields=['priority']),
        ]

    def __str__(self):
        return f"{self.project.name} - {self.title}"

    @property
    def is_overdue(self):
        if not self.due_date or self.status == 'DONE':
            return False
        from django.utils import timezone
        return timezone.now() > self.due_date

    @property
    def comment_count(self):
        return self.comments.count()


class TaskComment(models.Model):
    task = models.ForeignKey(
        Task, 
        on_delete=models.CASCADE, 
        related_name='comments'
    )
    content = models.TextField()
    author_email = models.EmailField(validators=[EmailValidator()])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'task_comments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task', 'created_at']),
            models.Index(fields=['author_email']),
        ]

    def __str__(self):
        return f"Comment on {self.task.title} by {self.author_email}"