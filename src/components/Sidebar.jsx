import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Cloud, PlusCircle ,Aws} from 'lucide-react';
import InfrastructureForm from './InfrastructureForm';

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = (value) => {
    setModalOpen(value);
  };
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Layout, path: '/' },
    { id: 'aws', label: 'AWS Clusters', icon: "aws", path: '/provider/aws' },
    { id: 'gcp', label: 'GCP Clusters', icon: "gcp", path: '/provider/gcp' },
    { id: 'azure', label: 'Azure Clusters', icon: "azure", path: '/provider/azure' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Infrastructure</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center px-4 py-2 rounded-lg text-sm ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {item.id === 'aws' || item.id==='gcp' || item.id==='azure' ? <img 
                src={`/images/${item.icon}.png`}
                className="w-5 h-5 mr-3"
              /> : <item.icon className="w-5 h-5 mr-3" />}
                
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={() => openModal(true)}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Create Infrastructure
        </button>
      </div>
      <InfrastructureForm isOpen={isModalOpen} openModal={openModal} />
    </div>
  );
};