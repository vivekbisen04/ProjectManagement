import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/client';
import { 
  Organization, 
  Project, 
  Task, 
  TaskComment, 
  ProjectStats,
  CreateProjectInput,
  CreateTaskInput,
  CreateCommentInput,
  UpdateTaskInput
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import {
  GET_ORGANIZATIONS,
  GET_PROJECTS,
  GET_TASKS,
  GET_TASK_COMMENTS,
  GET_PROJECT_STATS
} from '../graphql/queries';
import {
  CREATE_ORGANIZATION,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  CREATE_TASK,
  UPDATE_TASK,
  DELETE_TASK,
  CREATE_TASK_COMMENT
} from '../graphql/mutations';

interface GraphQLDataContextType {
  // Current organization
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization) => void;
  
  // Organizations
  organizations: Organization[];
  organizationsLoading: boolean;
  organizationsError: any;
  createOrganization: (org: Omit<Organization, 'id' | 'createdAt' | 'isActive'>) => Promise<Organization | null>;
  
  // Projects
  projects: Project[];
  projectsLoading: boolean;
  projectsError: any;
  refetchProjects: () => void;
  createProject: (input: CreateProjectInput) => Promise<Project | null>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<Project | null>;
  deleteProject: (id: string) => Promise<boolean>;
  getProjectStats: () => ProjectStats | null;
  projectStatsLoading: boolean;
  
  // Tasks
  tasks: Task[];
  tasksLoading: boolean;
  tasksError: any;
  refetchTasks: () => void;
  getTasksByProject: (projectId: string) => Task[];
  createTask: (input: CreateTaskInput) => Promise<Task | null>;
  updateTask: (input: UpdateTaskInput) => Promise<Task | null>;
  deleteTask: (id: string) => Promise<boolean>;
  
  // Comments
  getCommentsByTask: (taskId: string) => TaskComment[];
  createComment: (input: CreateCommentInput) => Promise<TaskComment | null>;
}

const GraphQLDataContext = createContext<GraphQLDataContextType | undefined>(undefined);

export function GraphQLDataProvider({ children }: { children: ReactNode }) {
  const client = useApolloClient();
  const [currentOrg, setCurrentOrg] = useLocalStorage<Organization | null>('currentOrg', null);

  // Organizations
  const { data: orgsData, loading: organizationsLoading, error: organizationsError } = useQuery(GET_ORGANIZATIONS);
  const [createOrgMutation] = useMutation(CREATE_ORGANIZATION);

  // Projects
  const { data: projectsData, loading: projectsLoading, error: projectsError, refetch: refetchProjects } = useQuery(GET_PROJECTS, {
    skip: !currentOrg,
    variables: { limit: 50, offset: 0 }
  });

  // Project Stats
  const { data: statsData, loading: projectStatsLoading } = useQuery(GET_PROJECT_STATS, {
    skip: !currentOrg
  });

  // Tasks
  const { data: tasksData, loading: tasksLoading, error: tasksError, refetch: refetchTasks } = useQuery(GET_TASKS, {
    skip: !currentOrg,
    variables: { limit: 100, offset: 0 }
  });

  // Mutations
  const [createProjectMutation] = useMutation(CREATE_PROJECT);
  const [updateProjectMutation] = useMutation(UPDATE_PROJECT);
  const [deleteProjectMutation] = useMutation(DELETE_PROJECT);
  const [createTaskMutation] = useMutation(CREATE_TASK);
  const [updateTaskMutation] = useMutation(UPDATE_TASK);
  const [deleteTaskMutation] = useMutation(DELETE_TASK);
  const [createCommentMutation] = useMutation(CREATE_TASK_COMMENT);

  const organizations: Organization[] = orgsData?.organizations || [];
  const projects: Project[] = projectsData?.projects || [];
  const tasks: Task[] = tasksData?.tasks || [];

  const createOrganization = async (orgData: Omit<Organization, 'id' | 'createdAt' | 'isActive'>) => {
    try {
      const { data } = await createOrgMutation({
        variables: orgData,
        refetchQueries: [{ query: GET_ORGANIZATIONS }]
      });
      return data?.createOrganization?.organization || null;
    } catch (error) {
      console.error('Error creating organization:', error);
      return null;
    }
  };

  const createProject = async (input: CreateProjectInput): Promise<Project | null> => {
    try {
      // Clean up the input - convert empty strings to null for optional fields
      const cleanInput = {
        ...input,
        dueDate: input.dueDate && input.dueDate.trim() ? input.dueDate : null,
        description: input.description && input.description.trim() ? input.description : ''
      };
      
      const { data } = await createProjectMutation({
        variables: cleanInput,
        refetchQueries: [
          { query: GET_PROJECTS, variables: { limit: 50, offset: 0 } },
          { query: GET_PROJECT_STATS }
        ]
      });
      return data?.createProject?.project || null;
    } catch (error) {
      console.error('Error creating project:', error);
      return null;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<Project | null> => {
    try {
      // Clean up the updates - convert empty strings to null for optional fields
      const cleanUpdates = {
        ...updates,
        dueDate: updates.dueDate && updates.dueDate.trim() ? updates.dueDate : null,
        description: updates.description && updates.description.trim() ? updates.description : ''
      };
      
      const { data } = await updateProjectMutation({
        variables: { id, ...cleanUpdates },
        refetchQueries: [
          { query: GET_PROJECTS, variables: { limit: 50, offset: 0 } },
          { query: GET_PROJECT_STATS }
        ]
      });
      return data?.updateProject?.project || null;
    } catch (error) {
      console.error('Error updating project:', error);
      return null;
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteProjectMutation({
        variables: { id },
        refetchQueries: [
          { query: GET_PROJECTS, variables: { limit: 50, offset: 0 } },
          { query: GET_PROJECT_STATS }
        ]
      });
      return data?.deleteProject?.success || false;
    } catch (error) {
      console.error('Error deleting project:', error);
      return false;
    }
  };

  const createTask = async (input: CreateTaskInput): Promise<Task | null> => {
    try {
      // Clean up the input - convert empty strings to null for optional fields
      const cleanInput = {
        ...input,
        dueDate: input.dueDate && input.dueDate.trim() ? 
          (input.dueDate.includes('T') ? `${input.dueDate}:00Z` : `${input.dueDate}T12:00:00Z`) : null,
        description: input.description && input.description.trim() ? input.description : '',
        assigneeEmail: input.assigneeEmail && input.assigneeEmail.trim() ? input.assigneeEmail : ''
      };
      
      const { data } = await createTaskMutation({
        variables: cleanInput,
        refetchQueries: [
          { query: GET_TASKS, variables: { limit: 100, offset: 0 } },
          { query: GET_PROJECTS, variables: { limit: 50, offset: 0 } },
          { query: GET_PROJECT_STATS }
        ]
      });
      return data?.createTask?.task || null;
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  };

  const updateTask = async (input: UpdateTaskInput): Promise<Task | null> => {
    try {
      // Clean up the input - convert empty strings to null for optional fields
      const cleanInput = {
        ...input,
        dueDate: input.dueDate && input.dueDate.trim() ? 
          (input.dueDate.includes('T') ? `${input.dueDate}:00Z` : `${input.dueDate}T12:00:00Z`) : null,
        description: input.description && input.description.trim() ? input.description : undefined,
        assigneeEmail: input.assigneeEmail && input.assigneeEmail.trim() ? input.assigneeEmail : undefined
      };
      
      const { data } = await updateTaskMutation({
        variables: cleanInput,
        refetchQueries: [
          { query: GET_TASKS, variables: { limit: 100, offset: 0 } },
          { query: GET_PROJECTS, variables: { limit: 50, offset: 0 } },
          { query: GET_PROJECT_STATS }
        ]
      });
      return data?.updateTask?.task || null;
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  };

  const deleteTask = async (id: string): Promise<boolean> => {
    try {
      const { data } = await deleteTaskMutation({
        variables: { id },
        refetchQueries: [
          { query: GET_TASKS, variables: { limit: 100, offset: 0 } },
          { query: GET_PROJECTS, variables: { limit: 50, offset: 0 } },
          { query: GET_PROJECT_STATS }
        ]
      });
      return data?.deleteTask?.success || false;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  };

  const createComment = async (input: CreateCommentInput): Promise<TaskComment | null> => {
    try {
      const { data } = await createCommentMutation({
        variables: input,
        refetchQueries: [
          { query: GET_TASK_COMMENTS, variables: { taskId: input.taskId } },
          { query: GET_TASKS, variables: { limit: 100, offset: 0 } }
        ]
      });
      return data?.createTaskComment?.comment || null;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  };

  const getTasksByProject = (projectId: string): Task[] => {
    return tasks.filter(task => task.project.id === projectId);
  };

  const getCommentsByTask = (taskId: string): TaskComment[] => {
    const { data } = client.readQuery({
      query: GET_TASK_COMMENTS,
      variables: { taskId }
    }) || {};
    return data?.taskComments || [];
  };

  const getProjectStats = (): ProjectStats | null => {
    return statsData?.projectStats || null;
  };

  return (
    <GraphQLDataContext.Provider value={{
      currentOrg,
      setCurrentOrg,
      organizations,
      organizationsLoading,
      organizationsError,
      createOrganization,
      projects,
      projectsLoading,
      projectsError,
      refetchProjects,
      createProject,
      updateProject,
      deleteProject,
      getProjectStats,
      projectStatsLoading,
      tasks,
      tasksLoading,
      tasksError,
      refetchTasks,
      getTasksByProject,
      createTask,
      updateTask,
      deleteTask,
      getCommentsByTask,
      createComment
    }}>
      {children}
    </GraphQLDataContext.Provider>
  );
}

export function useGraphQLData() {
  const context = useContext(GraphQLDataContext);
  if (context === undefined) {
    throw new Error('useGraphQLData must be used within a GraphQLDataProvider');
  }
  return context;
}