import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';

interface TaskBoardProps {
  tasks: Task[];
  projectId: string;
  onCreateTask: (task: any) => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask?: (id: string) => void;
  onTaskClick: (task: Task) => void;
  loading?: boolean;
}

const columns = [
  { id: 'TODO' as const, title: 'To Do', color: 'bg-gray-100' },
  { id: 'IN_PROGRESS' as const, title: 'In Progress', color: 'bg-blue-100' },
  { id: 'DONE' as const, title: 'Done', color: 'bg-green-100' },
  { id: 'BLOCKED' as const, title: 'Blocked', color: 'bg-red-100' }
];

export function TaskBoard({ tasks, projectId, onCreateTask, onUpdateTask, onDeleteTask, onTaskClick, loading }: TaskBoardProps) {
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<Task['status']>('TODO');

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter(task => task.status === status);
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onUpdateTask(taskId, { status });
  };

  const handleCreateTask = (data: any) => {
    onCreateTask({
      ...data,
      projectId,
      status: selectedColumn
    });
    setShowTaskForm(false);
  };

  return (
    <div className="h-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {columns.map((column) => {
          const columnTasks = getTasksByStatus(column.id);
          
          return (
            <div key={column.id} className="flex flex-col">
              {/* Column Header */}
              <div className={`${column.color} rounded-lg p-4 mb-4`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900">{column.title}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{columnTasks.length}</span>
                    <button
                      onClick={() => {
                        setSelectedColumn(column.id);
                        setShowTaskForm(true);
                      }}
                      className="w-6 h-6 bg-white rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                    >
                      <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Task Cards */}
              <div
                className="flex-1 space-y-3 min-h-96"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id)}
              >
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task.id)}
                  >
                    <TaskCard
                      task={task}
                      onClick={() => onTaskClick(task)}
                      onDelete={onDeleteTask}
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <TaskForm
        isOpen={showTaskForm}
        onSubmit={handleCreateTask}
        onCancel={() => setShowTaskForm(false)}
      />
    </div>
  );
}