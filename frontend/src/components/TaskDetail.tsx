import React, { useState } from 'react';
import { X, Calendar, Mail, MessageSquare, Send } from 'lucide-react';
import { Task, TaskComment } from '../types';

interface TaskDetailProps {
  task: Task | null;
  comments: TaskComment[];
  onClose: () => void;
  onAddComment: (content: string, authorEmail: string) => void;
  isOpen: boolean;
}

export function TaskDetail({ task, comments, onClose, onAddComment, isOpen }: TaskDetailProps) {
  const [commentText, setCommentText] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && authorEmail.trim()) {
      onAddComment(commentText.trim(), authorEmail.trim());
      setCommentText('');
      setAuthorEmail('');
    }
  };

  if (!isOpen || !task) return null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-screen overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-96">
          <div className="p-6 flex-1 overflow-y-auto">
            {/* Task Details */}
            <div className="space-y-4 mb-6">
              {task.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{task.description}</p>
                </div>
              )}

              <div className="flex items-center space-x-6">
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  task.status === 'TODO' ? 'bg-gray-100 text-gray-800' :
                  task.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                  task.status === 'DONE' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {task.status.replace('_', ' ')}
                </div>

                {task.assigneeEmail && (
                  <div className="flex items-center space-x-1 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{task.assigneeEmail}</span>
                  </div>
                )}

                {task.dueDate && (
                  <div className={`flex items-center space-x-1 text-sm ${
                    isOverdue ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    <Calendar className="w-4 h-4" />
                    <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Comments */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4" />
                <span>Comments ({comments.length})</span>
              </h3>

              <div className="space-y-3 mb-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">{comment.authorEmail}</span>
                      <span className="text-xs text-gray-500">
                        {new Date(comment.timestamp).toLocaleDateString()} at{' '}
                        {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{comment.content}</p>
                  </div>
                ))}
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleSubmitComment} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="Your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!commentText.trim() || !authorEmail.trim()}
                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}