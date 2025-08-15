import React from 'react';
import { Calendar, CheckCircle2, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { Project, ProjectStats } from '../types';

interface ProjectCardProps {
  project: Project;
  stats: ProjectStats;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  ACTIVE: { color: 'bg-green-100 text-green-800', icon: CheckCircle2, label: 'Active' },
  COMPLETED: { color: 'bg-blue-100 text-blue-800', icon: CheckCircle2, label: 'Completed' },
  ON_HOLD: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'On Hold' },
  ARCHIVED: { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Archived' }
};

export function ProjectCard({ project, stats, onClick, onDelete }: ProjectCardProps) {
  const status = statusConfig[project.status] || { color: 'bg-gray-100 text-gray-800', icon: AlertCircle, label: 'Unknown' };
  const StatusIcon = status.icon;
  
  const isOverdue = project.dueDate && new Date(project.dueDate) < new Date();

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer group"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {project.name}
        </h3>
        <div className="flex items-center space-x-2">
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
            <StatusIcon className="w-3 h-3" />
            <span>{status.label}</span>
          </div>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
              title="Delete Project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Stats */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="text-sm">
          <span className="font-medium text-gray-900">{stats.completedTasks}</span>
          <span className="text-gray-500">/{stats.totalTasks} tasks</span>
        </div>
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
        <span className="text-sm font-medium text-gray-900">
          {Math.round(stats.completionRate)}%
        </span>
      </div>

      {/* Due Date */}
      {project.dueDate && (
        <div className={`flex items-center space-x-2 text-sm ${
          isOverdue ? 'text-red-600' : 'text-gray-500'
        }`}>
          {isOverdue ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <Calendar className="w-4 h-4" />
          )}
          <span>
            Due {new Date(project.dueDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  );
}