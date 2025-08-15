import React from 'react';
import { GraphQLDataProvider } from './context/GraphQLDataContext';
import { Layout } from './components/Layout';
import { ProjectDashboard } from './components/ProjectDashboard';

function App() {
  return (
    <GraphQLDataProvider>
      <Layout>
        <ProjectDashboard />
      </Layout>
    </GraphQLDataProvider>
  );
}

export default App;