import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import { 
  Organization, 
  Project, 
  Task, 
  TaskComment, 
  ProjectStats,
  CreateProjectInput,
  CreateTaskInput,
  CreateCommentInput
} from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DataContextType {
  // Current organization
  currentOrg: Organization | null;
  setCurrentOrg: (org: Organization) => void;
  
  // Organizations
  organizations: Organization[];
  createOrganization: (org: Omit<Organization, 'id' | 'createdAt'>) => Organization;
  
  // Projects
  projects: Project[];
  getProjectsByOrg: (orgId: string) => Project[];
  createProject: (input: CreateProjectInput) => Project;
  updateProject: (id: string, updates: Partial<Project>) => Project | null;
  getProjectStats: (projectId: string) => ProjectStats;
  
  // Tasks
  tasks: Task[];
  getTasksByProject: (projectId: string) => Task[];
  createTask: (input: CreateTaskInput) => Task;
  updateTask: (id: string, updates: Partial<Task>) => Task | null;
  deleteTask: (id: string) => void;
  
  // Comments
  comments: TaskComment[];
  getCommentsByTask: (taskId: string) => TaskComment[];
  createComment: (input: CreateCommentInput) => TaskComment;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Generate sample data
const generateSampleData = () => {
  const orgs: Organization[] = [
    {
      id: '1',
      name: 'TechCorp Solutions',
      slug: 'techcorp',
      contactEmail: 'admin@techcorp.com',
      createdAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      name: 'Design Studio',
      slug: 'design-studio',
      contactEmail: 'hello@designstudio.com',
      createdAt: '2024-01-02T00:00:00Z'
    }
  ];

  const projects: Project[] = [
    {
      id: '1',
      organizationId: '1',
      name: 'E-commerce Platform',
      description: 'Build a modern e-commerce platform with React and Node.js',
      status: 'ACTIVE',
      dueDate: '2024-03-15',
      createdAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '2',
      organizationId: '1',
      name: 'Mobile App Development',
      description: 'Cross-platform mobile application using React Native',
      status: 'ACTIVE',
      dueDate: '2024-04-01',
      createdAt: '2024-01-20T00:00:00Z'
    },
    {
      id: '3',
      organizationId: '2',
      name: 'Brand Redesign',
      description: 'Complete brand identity redesign and guidelines',
      status: 'ACTIVE',
      dueDate: '2024-02-28',
      createdAt: '2024-01-10T00:00:00Z'
    }
  ];

  const tasks: Task[] = [
    {
      id: '1',
      projectId: '1',
      title: 'Set up project structure',
      description: 'Initialize React project with TypeScript and necessary dependencies',
      status: 'DONE',
      assigneeEmail: 'john@techcorp.com',
      createdAt: '2024-01-16T00:00:00Z'
    },
    {
      id: '2',
      projectId: '1',
      title: 'Design database schema',
      description: 'Create database tables for products, users, and orders',
      status: 'DONE',
      assigneeEmail: 'sarah@techcorp.com',
      createdAt: '2024-01-17T00:00:00Z'
    },
    {
      id: '3',
      projectId: '1',
      title: 'Implement user authentication',
      description: 'Add JWT-based authentication system',
      status: 'IN_PROGRESS',
      assigneeEmail: 'mike@techcorp.com',
      createdAt: '2024-01-18T00:00:00Z'
    },
    {
      id: '4',
      projectId: '1',
      title: 'Create product catalog',
      description: 'Build product listing and detail pages',
      status: 'TODO',
      assigneeEmail: 'lisa@techcorp.com',
      createdAt: '2024-01-19T00:00:00Z'
    },
    {
      id: '5',
      projectId: '3',
      title: 'Logo design concepts',
      description: 'Create 5 initial logo design concepts',
      status: 'IN_PROGRESS',
      assigneeEmail: 'anna@designstudio.com',
      createdAt: '2024-01-11T00:00:00Z'
    }
  ];

  const comments: TaskComment[] = [
    {
      id: '1',
      taskId: '3',
      content: 'Started working on the JWT implementation. Using bcrypt for password hashing.',
      authorEmail: 'mike@techcorp.com',
      timestamp: '2024-01-22T10:30:00Z'
    },
    {
      id: '2',
      taskId: '3',
      content: 'Great progress! Make sure to implement refresh token functionality as well.',
      authorEmail: 'john@techcorp.com',
      timestamp: '2024-01-22T14:15:00Z'
    }
  ];

  return { organizations: orgs, projects, tasks, comments };
};

export function DataProvider({ children }: { children: ReactNode }) {
  const [currentOrg, setCurrentOrg] = useLocalStorage<Organization | null>('currentOrg', null);
  const [organizations, setOrganizations] = useLocalStorage<Organization[]>('organizations', []);
  const [projects, setProjects] = useLocalStorage<Project[]>('projects', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [comments, setComments] = useLocalStorage<TaskComment[]>('comments', []);

  // Initialize with sample data if empty
  React.useEffect(() => {
    if (organizations.length === 0) {
      const sampleData = generateSampleData();
      setOrganizations(sampleData.organizations);
      setProjects(sampleData.projects);
      setTasks(sampleData.tasks);
      setComments(sampleData.comments);
      setCurrentOrg(sampleData.organizations[0]);
    }
  }, [organizations.length, setOrganizations, setProjects, setTasks, setComments, setCurrentOrg]);

  const createOrganization = useCallback((orgData: Omit<Organization, 'id' | 'createdAt'>) => {
    const newOrg: Organization = {
      ...orgData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setOrganizations(prev => [...prev, newOrg]);
    return newOrg;
  }, [setOrganizations]);

  const getProjectsByOrg = useCallback((orgId: string) => {
    return projects.filter(project => project.organizationId === orgId);
  }, [projects]);

  const createProject = useCallback((input: CreateProjectInput) => {
    if (!currentOrg) throw new Error('No organization selected');
    
    const newProject: Project = {
      ...input,
      id: Date.now().toString(),
      organizationId: currentOrg.id,
      createdAt: new Date().toISOString()
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, [currentOrg, setProjects]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    let updatedProject: Project | null = null;
    setProjects(prev => prev.map(project => {
      if (project.id === id) {
        updatedProject = { ...project, ...updates };
        return updatedProject;
      }
      return project;
    }));
    return updatedProject;
  }, [setProjects]);

  const getProjectStats = useCallback((projectId: string): ProjectStats => {
    const projectTasks = tasks.filter(task => task.projectId === projectId);
    const totalTasks = projectTasks.length;
    const completedTasks = projectTasks.filter(task => task.status === 'DONE').length;
    const inProgressTasks = projectTasks.filter(task => task.status === 'IN_PROGRESS').length;
    const todoTasks = projectTasks.filter(task => task.status === 'TODO').length;
    
    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      todoTasks,
      completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    };
  }, [tasks]);

  const getTasksByProject = useCallback((projectId: string) => {
    return tasks.filter(task => task.projectId === projectId);
  }, [tasks]);

  const createTask = useCallback((input: CreateTaskInput) => {
    const newTask: Task = {
      ...input,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setTasks(prev => [...prev, newTask]);
    return newTask;
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    let updatedTask: Task | null = null;
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        updatedTask = { ...task, ...updates };
        return updatedTask;
      }
      return task;
    }));
    return updatedTask;
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    setComments(prev => prev.filter(comment => comment.taskId !== id));
  }, [setTasks, setComments]);

  const getCommentsByTask = useCallback((taskId: string) => {
    return comments.filter(comment => comment.taskId === taskId);
  }, [comments]);

  const createComment = useCallback((input: CreateCommentInput) => {
    const newComment: TaskComment = {
      ...input,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setComments(prev => [...prev, newComment]);
    return newComment;
  }, [setComments]);

  return (
    <DataContext.Provider value={{
      currentOrg,
      setCurrentOrg,
      organizations,
      createOrganization,
      projects,
      getProjectsByOrg,
      createProject,
      updateProject,
      getProjectStats,
      tasks,
      getTasksByProject,
      createTask,
      updateTask,
      deleteTask,
      comments,
      getCommentsByTask,
      createComment
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}