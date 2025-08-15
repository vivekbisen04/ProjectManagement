from django.db import models
from django.utils.text import slugify
from django.core.validators import EmailValidator


class Organization(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True, blank=True)
    contact_email = models.EmailField(validators=[EmailValidator()])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = 'organizations'
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def project_count(self):
        return self.projects.count()

    @property
    def task_count(self):
        return sum(project.tasks.count() for project in self.projects.all())