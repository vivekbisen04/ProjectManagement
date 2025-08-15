import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
  // Get organization slug from localStorage
  const currentOrg = localStorage.getItem('currentOrg');
  const orgSlug = currentOrg ? JSON.parse(currentOrg)?.slug : null;

  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      ...(orgSlug && { 'X-Organization-Slug': orgSlug })
    }
  }
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: {
      Project: {
        fields: {
          taskCount: {
            read(existing) {
              return existing ?? 0;
            }
          },
          completedTasks: {
            read(existing) {
              return existing ?? 0;
            }
          },
          completionRate: {
            read(existing) {
              return existing ?? 0;
            }
          }
        }
      },
      Task: {
        fields: {
          commentCount: {
            read(existing) {
              return existing ?? 0;
            }
          }
        }
      }
    }
  }),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all'
    },
    query: {
      errorPolicy: 'all'
    }
  }
});