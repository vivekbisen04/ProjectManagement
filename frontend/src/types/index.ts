// Backend GraphQL Schema Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  contactEmail: string;
  createdAt: string;
  isActive: boolean;
  projectCount?: number;
  taskCount?: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'COMPLETED' | 'ON_HOLD' | 'ARCHIVED';
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  organization: Organization;
  taskCount?: number;
  completedTasks?: number;
  completionRate?: number;
  isOverdue?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'TODO' | 'IN_PROGRESS' | 'DONE' | 'BLOCKED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  assigneeEmail: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  project: Project;
  isOverdue?: boolean;
  commentCount?: number;
}

export interface TaskComment {
  id: string;
  content: string;
  authorEmail: string;
  createdAt: string;
  updatedAt: string;
  task: Task;
}

export interface ProjectStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  completionRate: number;
}

// Input Types for Mutations
export interface CreateProjectInput {
  name: string;
  description?: string;
  status?: Project['status'];
  dueDate?: string;
}

export interface UpdateProjectInput {
  id: string;
  name?: string;
  description?: string;
  status?: Project['status'];
  dueDate?: string;
}

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assigneeEmail?: string;
  dueDate?: string;
}

export interface UpdateTaskInput {
  id: string;
  title?: string;
  description?: string;
  status?: Task['status'];
  priority?: Task['priority'];
  assigneeEmail?: string;
  dueDate?: string;
}

export interface CreateCommentInput {
  taskId: string;
  content: string;
  authorEmail: string;
}

// Response Types
export interface MutationResponse {
  success: boolean;
  errors: string[];
}

export interface CreateProjectResponse extends MutationResponse {
  project?: Project;
}

export interface UpdateProjectResponse extends MutationResponse {
  project?: Project;
}

export interface CreateTaskResponse extends MutationResponse {
  task?: Task;
}

export interface UpdateTaskResponse extends MutationResponse {
  task?: Task;
}

export interface CreateCommentResponse extends MutationResponse {
  comment?: TaskComment;
}