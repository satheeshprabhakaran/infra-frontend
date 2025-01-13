import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2, ArrowLeft, Server, Globe, Tag, Network, Box, Clock, Activity } from 'lucide-react';
import data from '../demo.json';
const ClusterDetail = () => {
  const [cluster, setCluster] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { clusterId } = useParams();
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');
  const cloud = searchParams.get('cloud');
  const account_type = searchParams.get('account_type');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClusterDetails();
  }, [clusterId, region, cloud, account_type]);

  const fetchClusterDetails = async () => {
    try {
      setLoading(true);
      // Default values or get from URL params
      const defaultCloud = 'aws';
      const defaultAccountType = 'production';

      const urlParams = new URLSearchParams(window.location.search);
      const cloudProvider = urlParams.get('cloud') || defaultCloud;
      const accountType = urlParams.get('account_type') || defaultAccountType;

      console.log(`Fetching cluster details with:`, {
        clusterId,
        region,
        cloud: cloudProvider,
        accountType
      });

      // const response = await fetch(
      //   `http://localhost:8000/api/clusters/${clusterId}?region=${region}&cloud=${cloudProvider}&account_type=${accountType}`
      // );

      // if (!response.ok) {
      //   throw new Error('Failed to fetch cluster details');
      // }
     // const data = await response.json();
      setCluster(data.cluster);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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

  if (!cluster) {
    return (
      <div className="text-gray-500">No cluster details found</div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Clusters
        </button>
        <span className={`px-3 py-1 rounded-full text-sm ${
          cluster.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {cluster.status}
        </span>
      </div>

      {/* Basic Info Card */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold flex items-center">
              <Server className="w-6 h-6 mr-3 text-blue-500" />
              {cluster.name}
            </h2>
            <div className="flex items-center">
              <img 
                src={`/images/${cluster.provider.toLowerCase()}.png`}
                alt={cluster.provider}
                className="h-6 w-6 mr-2"
              />
              <span className="text-gray-600">{cluster.provider}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center text-gray-600">
              <Globe className="w-5 h-5 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-500">Region</div>
                <div>{cluster.region}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Box className="w-5 h-5 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-500">Version</div>
                <div>{cluster.version}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-5 h-5 mr-2" />
              <div>
                <div className="text-sm font-medium text-gray-500">Created</div>
                <div>{new Date(cluster.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Network Info */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium flex items-center">
            <Network className="w-5 h-5 mr-2 text-blue-500" />
            Network Configuration
          </h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">VPC ID</div>
            <div className="font-mono text-sm bg-gray-50 p-2 rounded">{cluster.vpcId}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-500 mb-1">Service CIDR</div>
            <div className="font-mono text-sm bg-gray-50 p-2 rounded">{cluster.serviceIpv4Cidr}</div>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium flex items-center">
            <Tag className="w-5 h-5 mr-2 text-blue-500" />
            Tags
          </h3>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">
            {Object.entries(cluster.tags).map(([key, value]) => (
              <div key={key} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                <span className="font-medium">{key}:</span> {value}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Node Groups */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium flex items-center">
            <Activity className="w-5 h-5 mr-2 text-blue-500" />
            Node Groups
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Instance Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disk Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Min/Max</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cluster.nodeGroups.map((nodeGroup) => (
                <tr key={nodeGroup.name} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {nodeGroup.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      nodeGroup.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {nodeGroup.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {nodeGroup.instanceType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {nodeGroup.diskSize} GB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {nodeGroup.minSize} / {nodeGroup.maxSize}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                      {nodeGroup.capacityType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClusterDetail;