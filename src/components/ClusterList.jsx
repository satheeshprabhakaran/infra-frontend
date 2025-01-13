import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2, Globe, Users, Server, Filter } from 'lucide-react';

const ClusterList = () => {
  const [clusters, setClusters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    region: 'all',
  });
  const navigate = useNavigate();
  const { provider } = useParams();

  useEffect(() => {
    fetchClusters();
  }, [provider, filters]);

  const fetchClusters = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8000/api/clusters');
      if (!response.ok) {
        throw new Error('Failed to fetch clusters');
      }
      const data = await response.json();
      if (provider) {
        const filteredClusters = data.clusters.filter(
          cluster => cluster.provider.toLowerCase() === provider.toLowerCase()
        );
        setClusters(filteredClusters);
      } else {
        setClusters(data.clusters);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterClusters = (clusters) => {
    return clusters.filter(cluster => {
      const typeMatch = filters.type === 'all' || cluster.type === filters.type;
      const regionMatch = filters.region === 'all' || cluster.region === filters.region;
      return typeMatch && regionMatch;
    });
  };

  const getUniqueRegions = () => {
    const regions = new Set(clusters.map(cluster => cluster.region));
    return ['all', ...regions];
  };

  const handleClusterClick = (cluster) => {
    navigate(`/clusters/${cluster.name}?region=${cluster.region}&cloud=${cluster.provider}&account_type=${cluster.account_type}`);
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

  const filteredClusters = filterClusters(clusters);
  const regions = getUniqueRegions();

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="border rounded-md px-3 py-1.5"
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="all">All Types</option>
            <option value="Production">Production</option>
            <option value="Non-Production">Non-Production</option>
          </select>
          <select
            className="border rounded-md px-3 py-1.5"
            value={filters.region}
            onChange={(e) => setFilters(prev => ({ ...prev, region: e.target.value }))}
          >
            {regions.map(region => (
              <option key={region} value={region}>
                {region === 'all' ? 'All Regions' : region}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex gap-4">
          <div className="text-sm">
            <span className="font-medium">Total Clusters:</span> {filteredClusters.length}
          </div>
          <div className="text-sm">
            <span className="font-medium">Production:</span>{' '}
            {filteredClusters.filter(c => c.type === 'Production').length}
          </div>
          <div className="text-sm">
            <span className="font-medium">Non-Production:</span>{' '}
            {filteredClusters.filter(c => c.type === 'Non-Production').length}
          </div>
        </div>
      </div>

      {/* Cluster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClusters.map((cluster) => (
          <div
            key={cluster.name}
            onClick={() => handleClusterClick(cluster)}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer p-4"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium">{cluster.name}</h3>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  cluster.type === 'Production'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
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
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClusterList;