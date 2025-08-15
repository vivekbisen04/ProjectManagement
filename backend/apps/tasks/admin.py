from django.contrib import admin
from .models import Task, TaskComment


class TaskCommentInline(admin.TabularInline):
    model = TaskComment
    extra = 0
    readonly_fields = ['created_at']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'status', 'priority', 'assignee_email', 'due_date', 'is_overdue', 'created_at']
    list_filter = ['status', 'priority', 'project__organization', 'project', 'due_date', 'created_at']
    search_fields = ['title', 'description', 'assignee_email', 'project__name']
    readonly_fields = ['created_at', 'updated_at', 'is_overdue', 'comment_count']
    inlines = [TaskCommentInline]
    
    def is_overdue(self, obj):
        return obj.is_overdue
    is_overdue.boolean = True
    is_overdue.short_description = 'Overdue'
    
    def comment_count(self, obj):
        return obj.comment_count
    comment_count.short_description = 'Comments'


@admin.register(TaskComment)
class TaskCommentAdmin(admin.ModelAdmin):
    list_display = ['task', 'author_email', 'created_at']
    list_filter = ['created_at', 'task__project__organization']
    search_fields = ['content', 'author_email', 'task__title']
    readonly_fields = ['created_at', 'updated_at']