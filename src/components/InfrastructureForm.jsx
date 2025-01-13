import React, { useState } from 'react';
import { Loader2, CloudRain, Server, Building2 } from 'lucide-react';
import ProvisioningModal from './ProvisioningModal';
const InfrastructureForm = ( {isOpen,openModal}) => {
  const [formData, setFormData] = useState({
    cluster_name: '',
    customer_category: 'lyric',
    cloud_provider: 'aws',
    region: 'us-east-1',
    environment_type: 'notprod',
    compute_plan: 'standard'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const cloudProviders = ['aws', 'gcp', 'azure'];
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
  const envTypes = ['prod', 'notprod'];
  const computePlans = ['standard', 'gold', 'platinum'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:8000/api/provision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to create infrastructure');
      }

      setStatus({
        type: 'success',
        message: data.message
      });

      // Download YAML if available
      if (data.yaml) {
        const blob = new Blob([data.yaml], { type: 'text/yaml' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${formData.cluster_name}.yaml`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const onClose = () => openModal(false);

  return <ProvisioningModal isOpen={isOpen} onClose={onClose} handleSubmit={handleSubmit} formData={formData} handleInputChange={handleInputChange} cloudProviders={cloudProviders} regions={regions} envTypes={envTypes} computePlans={computePlans} isSubmitting={isSubmitting} status={status} />; 
};

export default InfrastructureForm;