from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['name', 'organization', 'status', 'due_date', 'task_count', 'completion_rate', 'created_at']
    list_filter = ['status', 'organization', 'due_date', 'created_at']
    search_fields = ['name', 'description', 'organization__name']
    readonly_fields = ['created_at', 'updated_at', 'task_count', 'completed_tasks', 'completion_rate']
    
    def task_count(self, obj):
        return obj.task_count
    task_count.short_description = 'Tasks'
    
    def completion_rate(self, obj):
        return f"{obj.completion_rate}%"
    completion_rate.short_description = 'Completion'