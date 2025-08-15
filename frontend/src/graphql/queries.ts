import { gql } from '@apollo/client';

// Organization Queries
export const GET_ORGANIZATIONS = gql`
  query GetOrganizations {
    organizations {
      id
      name
      slug
      contactEmail
      createdAt
      isActive
    }
  }
`;

// Project Queries
export const GET_PROJECTS = gql`
  query GetProjects($status: String, $search: String, $limit: Int, $offset: Int) {
    projects(status: $status, search: $search, limit: $limit, offset: $offset) {
      id
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      taskCount
      completedTasks
      completionRate
      isOverdue
      organization {
        id
        name
        slug
      }
    }
  }
`;

export const GET_PROJECT = gql`
  query GetProject($id: ID!) {
    project(id: $id) {
      id
      name
      description
      status
      dueDate
      createdAt
      updatedAt
      taskCount
      completedTasks
      completionRate
      isOverdue
      organization {
        id
        name
        slug
      }
    }
  }
`;

// Task Queries
export const GET_TASKS = gql`
  query GetTasks($projectId: ID, $status: String, $assigneeEmail: String, $search: String, $limit: Int, $offset: Int) {
    tasks(projectId: $projectId, status: $status, assigneeEmail: $assigneeEmail, search: $search, limit: $limit, offset: $offset) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      isOverdue
      commentCount
      project {
        id
        name
        organization {
          id
          name
        }
      }
    }
  }
`;

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
      priority
      assigneeEmail
      dueDate
      createdAt
      updatedAt
      isOverdue
      commentCount
      project {
        id
        name
        organization {
          id
          name
        }
      }
    }
  }
`;

// Task Comments
export const GET_TASK_COMMENTS = gql`
  query GetTaskComments($taskId: ID!) {
    taskComments(taskId: $taskId) {
      id
      content
      authorEmail
      createdAt
      updatedAt
      task {
        id
        title
      }
    }
  }
`;

// Statistics
export const GET_PROJECT_STATS = gql`
  query GetProjectStats {
    projectStats {
      totalProjects
      activeProjects
      completedProjects
      totalTasks
      completedTasks
      completionRate
    }
  }
`;