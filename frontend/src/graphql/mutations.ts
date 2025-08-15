import { gql } from '@apollo/client';

// Organization Mutations
export const CREATE_ORGANIZATION = gql`
  mutation CreateOrganization($name: String!, $contactEmail: String!) {
    createOrganization(name: $name, contactEmail: $contactEmail) {
      organization {
        id
        name
        slug
        contactEmail
        createdAt
        isActive
      }
      success
      errors
    }
  }
`;

// Project Mutations
export const CREATE_PROJECT = gql`
  mutation CreateProject($name: String!, $description: String, $status: String, $dueDate: Date) {
    createProject(name: $name, description: $description, status: $status, dueDate: $dueDate) {
      project {
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
      success
      errors
    }
  }
`;

export const UPDATE_PROJECT = gql`
  mutation UpdateProject($id: ID!, $name: String, $description: String, $status: String, $dueDate: Date) {
    updateProject(id: $id, name: $name, description: $description, status: $status, dueDate: $dueDate) {
      project {
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
      success
      errors
    }
  }
`;

// Task Mutations
export const CREATE_TASK = gql`
  mutation CreateTask(
    $projectId: ID!, 
    $title: String!, 
    $description: String, 
    $status: String, 
    $priority: String, 
    $assigneeEmail: String, 
    $dueDate: DateTime
  ) {
    createTask(
      projectId: $projectId,
      title: $title,
      description: $description,
      status: $status,
      priority: $priority,
      assigneeEmail: $assigneeEmail,
      dueDate: $dueDate
    ) {
      task {
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
        }
      }
      success
      errors
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask(
    $id: ID!, 
    $title: String, 
    $description: String, 
    $status: String, 
    $priority: String, 
    $assigneeEmail: String, 
    $dueDate: DateTime
  ) {
    updateTask(
      id: $id,
      title: $title,
      description: $description,
      status: $status,
      priority: $priority,
      assigneeEmail: $assigneeEmail,
      dueDate: $dueDate
    ) {
      task {
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
        }
      }
      success
      errors
    }
  }
`;

export const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID!) {
    deleteProject(id: $id) {
      success
      errors
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(id: $id) {
      success
      errors
    }
  }
`;

// Task Comment Mutations
export const CREATE_TASK_COMMENT = gql`
  mutation CreateTaskComment($taskId: ID!, $content: String!, $authorEmail: String!) {
    createTaskComment(taskId: $taskId, content: $content, authorEmail: $authorEmail) {
      comment {
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
      success
      errors
    }
  }
`;