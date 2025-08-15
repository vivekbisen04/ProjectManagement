import React, { useState } from 'react';
import { X } from 'lucide-react';
import { CreateTaskInput, Task } from '../types';

interface TaskFormProps {
  onSubmit: (data: Omit<CreateTaskInput, 'projectId'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export function TaskForm({ onSubmit, onCancel, isOpen }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM' as Task['priority'],
    assigneeEmail: '',
    dueDate: ''
  });

  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (formData.assigneeEmail && !/\S+@\S+\.\S+/.test(formData.assigneeEmail)) {
      newErrors.assigneeEmail = 'Please enter a valid email address';
    }

    if (formData.dueDate && new Date(formData.dueDate) < new Date()) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ title: '', description: '', priority: 'MEDIUM', assigneeEmail: '', dueDate: '' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Task</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Task Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter task title"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter task description"
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as Task['priority'] })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          <div>
            <label htmlFor="assigneeEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Assignee Email
            </label>
            <input
              id="assigneeEmail"
              type="email"
              value={formData.assigneeEmail}
              onChange={(e) => setFormData({ ...formData, assigneeEmail: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.assigneeEmail ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="assignee@example.com"
            />
            {errors.assigneeEmail && <p className="mt-1 text-sm text-red-600">{errors.assigneeEmail}</p>}
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              id="dueDate"
              type="datetime-local"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.dueDate ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.dueDate && <p className="mt-1 text-sm text-red-600">{errors.dueDate}</p>}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}