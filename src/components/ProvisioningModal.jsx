import { useState } from "react";

const ProvisioningModal = ({
  isOpen,
  onClose,
  handleSubmit,
  formData,
  handleInputChange,
  cloudProviders,
  regions,
  envTypes,
  computePlans,
  isSubmitting,
}) => {
  const [step, setStep] = useState(1);

  if (!isOpen) return null;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cluster Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cluster Name</label>
              <input
                type="text"
                name="cluster_name"
                value={formData.cluster_name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., dev-cluster"
                required
              />
            </div>
            {/* Customer Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Customer Category</label>
              <input
                type="text"
                name="customer_category"
                value={formData.customer_category}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
                placeholder="e.g., lyric"
                required
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cloud Provider */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Cloud Provider</label>
              {cloudProviders.map((provider) => (
                <div key={provider} className="flex items-center">
                  <input
                    type="radio"
                    id={provider}
                    name="cloud_provider"
                    value={provider}
                    checked={formData.cloud_provider === provider}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={provider}>{provider.toUpperCase()}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Region */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Region</label>
              {regions.map((region) => (
                <div key={region} className="flex items-center">
                  <input
                    type="radio"
                    id={region}
                    name="region"
                    value={region}
                    checked={formData.region === region}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={region}>{region}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Environment Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Environment Type</label>
              {envTypes.map((env) => (
                <div key={env} className="flex items-center">
                  <input
                    type="radio"
                    id={env}
                    name="environment_type"
                    value={env}
                    checked={formData.environment_type === env}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={env}>{env}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case 5:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Compute Plan */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Compute Plan</label>
              {computePlans.map((plan) => (
                <div key={plan} className="flex items-center">
                  <input
                    type="radio"
                    id={plan}
                    name="compute_plan"
                    value={plan}
                    checked={formData.compute_plan === plan}
                    onChange={handleInputChange}
                    className="mr-2"
                  />
                  <label htmlFor={plan}>{plan.charAt(0).toUpperCase() + plan.slice(1)}</label>
                </div>
              ))}
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Confirmation</h3>
            <ul>
              {Object.entries(formData).map(([key, value]) => (
                <li key={key} className="text-sm">
                  <strong>{key.replace(/_/g, " ")}:</strong> {value}
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-3xl">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Infrastructure Provisioning</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {renderStepContent()}

          <div className="flex justify-between">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Back
              </button>
            )}
            {step < 6 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {isSubmitting ? "Provisioning..." : "Confirm and Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProvisioningModal;