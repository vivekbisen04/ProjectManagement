import React, { useState } from 'react';
import { Plus, BarChart3, Folder, Loader2, AlertCircle } from 'lucide-react';
import { useGraphQLData } from '../context/GraphQLDataContext';
import { ProjectCard } from './ProjectCard';
import { ProjectForm } from './ProjectForm';
import { TaskBoard } from './TaskBoard';
import { TaskDetail } from './TaskDetail';
import { CreateProjectInput, Task } from '../types';

export function ProjectDashboard() {
  const {
    currentOrg,
    projects,
    projectsLoading,
    projectsError,
    createProject,
    updateProject,
    deleteProject,
    getProjectStats,
    projectStatsLoading,
    getTasksByProject,
    tasks,
    tasksLoading,
    createTask,
    updateTask,
    deleteTask,
    getCommentsByTask,
    createComment
  } = useGraphQLData();

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);

  if (!currentOrg) return null;

  const selectedProjectData = projects.find(p => p.id === selectedProject);
  const projectTasks = selectedProject ? getTasksByProject(selectedProject) : [];
  const taskComments = selectedTask ? getCommentsByTask(selectedTask.id) : [];
  const stats = getProjectStats();

  const handleCreateProject = async (data: CreateProjectInput) => {
    const result = await createProject(data);
    if (result) {
      setShowProjectForm(false);
    }
  };

  const handleCreateTask = async (data: any) => {
    await createTask(data);
  };

  const handleUpdateTask = async (id: string, updates: Partial<Task>) => {
    await updateTask({ id, ...updates });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  const handleAddComment = async (content: string, authorEmail: string) => {
    if (selectedTask) {
      await createComment({
        taskId: selectedTask.id,
        content,
        authorEmail
      });
    }
  };

  const handleCloseTaskDetail = () => {
    setShowTaskDetail(false);
    setSelectedTask(null);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks and cannot be undone.')) {
      const success = await deleteProject(id);
      if (!success) {
        alert('Failed to delete project. Please try again.');
      }
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task? This cannot be undone.')) {
      const success = await deleteTask(id);
      if (!success) {
        alert('Failed to delete task. Please try again.');
      }
    }
  };

  // Project List View
  if (!selectedProject) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600">{currentOrg.name}</p>
          </div>
          <button
            onClick={() => setShowProjectForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Folder className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                {projectStatsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.totalProjects || 0}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                {projectStatsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.activeProjects || 0}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Completed Projects</p>
                {projectStatsLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats?.completedProjects || 0}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Project Grid */}
        <div>
          {projectsError ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Error loading projects</h3>
              <p className="mt-2 text-sm text-gray-500">
                There was an error loading your projects. Please try again.
              </p>
            </div>
          ) : projectsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-2 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  stats={{
                    totalTasks: project.taskCount || 0,
                    completedTasks: project.completedTasks || 0,
                    inProgressTasks: 0,
                    todoTasks: 0,
                    completionRate: project.completionRate || 0
                  }}
                  onClick={() => setSelectedProject(project.id)}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Folder className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="mt-2 text-sm text-gray-500">
                Get started by creating your first project.
              </p>
              <button
                onClick={() => setShowProjectForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </button>
            </div>
          )}
        </div>

        <ProjectForm
          isOpen={showProjectForm}
          onSubmit={handleCreateProject}
          onCancel={() => setShowProjectForm(false)}
        />
      </div>
    );
  }

  // Task Board View
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => setSelectedProject(null)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium mb-2"
          >
            ← Back to Projects
          </button>
          <h1 className="text-2xl font-bold text-gray-900">{selectedProjectData?.name}</h1>
          <p className="text-gray-600">{selectedProjectData?.description}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">
            {projectTasks.filter(t => t.status === 'DONE').length} of {projectTasks.length} tasks completed
          </div>
          <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${projectTasks.length > 0 ? (projectTasks.filter(t => t.status === 'DONE').length / projectTasks.length) * 100 : 0}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Task Board */}
      <TaskBoard
        tasks={projectTasks}
        projectId={selectedProject}
        onCreateTask={handleCreateTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        onTaskClick={handleTaskClick}
        loading={tasksLoading}
      />

      {/* Task Detail Modal */}
      <TaskDetail
        task={selectedTask}
        comments={taskComments}
        isOpen={showTaskDetail}
        onClose={handleCloseTaskDetail}
        onAddComment={handleAddComment}
      />
    </div>
  );
}