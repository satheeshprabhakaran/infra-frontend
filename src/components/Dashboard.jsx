import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Server, Globe, Users, ChevronRight ,RefreshCcw} from 'lucide-react';
import data from '../cluster.json';
import demoData from '../demo.json';
const Dashboard = () => {
  const [clusterStats, setClusterStats] = useState({
    total: 0,
    byProvider: {},
    byType: {},
    byRegion: {}
  });
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClusters();
  }, []);

  const handleRefresh = () => {
    alert('Refreshing Data');
    fetchClusters(true);
  };

 
  const fetchClusters = async (force) => {
    try {

      // const response = await fetch('http://localhost:8000/api/clusters?force=' + force);
      // if (!response.ok) {
      //   throw new Error('Failed to fetch clusters');
      // }
     // const data = await response.json();
      setClusters(data.clusters);
      
      // Calculate statistics
      const stats = {
        total: data.clusters.length,
        byProvider: {},
        byType: {},
        byRegion: {}
      };
      
      data.clusters.forEach(cluster => {
        // Count by provider
        stats.byProvider[cluster.provider] = (stats.byProvider[cluster.provider] || 0) + 1;
        // Count by type
        stats.byType[cluster.type] = (stats.byType[cluster.type] || 0) + 1;
        // Count by region
        stats.byRegion[cluster.region] = (stats.byRegion[cluster.region] || 0) + 1;
      });
      
      setClusterStats(stats);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClusterClick = (cluster) => {
    navigate(`/clusters/${cluster.name}?region=${cluster.region}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-gray-500 text-sm font-medium">Total Clusters</h3>
    <p className="mt-2 text-3xl font-bold text-gray-900">{clusterStats.total}</p>
  </div>
  {Object.entries(clusterStats.byProvider).map(([provider, count]) => (
    <div key={provider} className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <img 
          src={`/images/${provider.toLowerCase()}.png`}
          alt={provider}
          className="h-6 w-6 mr-2"
        />
        <h3 className="text-gray-500 text-sm font-medium">{provider} Clusters</h3>
      </div>
      <p className="mt-2 text-3xl font-bold text-gray-900">{count}</p>
    </div>
  ))}

  {/* Refresh Icon */}
  <div 
    className="absolute bottom-20 right-4 bg-gray-100 rounded-full p-3 shadow cursor-pointer hover:bg-gray-200 transition" 
    onClick={handleRefresh}
    title="Refresh Data"
  >
   <RefreshCcw className="w-6 h-6 text-blue-500" />
  </div>
</div>

      {/* Clusters List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Clusters</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clusters.map((cluster) => (
              <button
                key={cluster.name}
                onClick={() => handleClusterClick(cluster)}
                className="block w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="font-medium flex items-center group">
                    {cluster.name}
                    <ChevronRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 text-blue-500" />
                  </h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    cluster.type === 'Production'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {cluster.type}
                  </span>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <img 
                      src={`/images/${cluster.provider.toLowerCase()}.png`}
                      alt={cluster.provider}
                      className="w-4 h-4 mr-2"
                    />
                    {cluster.provider}
                  </div>
                  
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 mr-2" />
                    {cluster.region}
                  </div>
                  
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    {cluster.customer_category}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;