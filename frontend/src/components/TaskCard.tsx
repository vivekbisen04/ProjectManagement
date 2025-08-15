import React from 'react';
import { Calendar, Mail, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onDelete?: (id: string) => void;
}

export function TaskCard({ task, onClick, onDelete }: TaskCardProps) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {task.title}
        </h4>
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-all duration-200"
            title="Delete Task"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="space-y-2">
        {task.assigneeEmail && (
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Mail className="w-3 h-3" />
            <span>{task.assigneeEmail}</span>
          </div>
        )}

        {task.dueDate && (
          <div className={`flex items-center space-x-2 text-xs ${
            isOverdue ? 'text-red-500' : 'text-gray-500'
          }`}>
            <Calendar className="w-3 h-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </div>
  );
}