// This is your main App component with routing setup
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ClusterList from './components/ClusterList';
import ClusterDetail from './components/ClusterDetail';
import InfrastructureForm from './components/InfrastructureForm';
import { Sidebar } from './components/Sidebar';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <BrowserRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/provider/:provider" element={<ClusterList />} />
              <Route path="/clusters/:clusterId" element={<ClusterDetail />} />
              <Route path="/create" element={<InfrastructureForm />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;