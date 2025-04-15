'use client';

import { useState, useEffect } from 'react';
import { getProjectData, setProjectData, deleteProjectData, listProjectData } from '@/lib/api/project-data';

interface ProjectDataManagerProps {
  projectId: number;
}

export default function ProjectDataManager({ projectId }: ProjectDataManagerProps) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Load all project data on component mount
  useEffect(() => {
    loadProjectData();
  }, [projectId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listProjectData(projectId);
      setDataList(data);
    } catch (err) {
      setError('Failed to load project data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!key.trim()) {
      setError('Key is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Parse value as JSON if possible, otherwise use as string
      let parsedValue = value;
      try {
        parsedValue = JSON.parse(value);
      } catch (e) {
        // If not valid JSON, use as string
      }
      
      await setProjectData(projectId, key, parsedValue);
      setSuccess('Data saved successfully');
      
      // Clear form
      setKey('');
      setValue('');
      
      // Reload data list
      await loadProjectData();
    } catch (err) {
      setError('Failed to save data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (keyToDelete: string) => {
    if (!confirm(`Are you sure you want to delete data with key "${keyToDelete}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      await deleteProjectData(projectId, keyToDelete);
      setSuccess('Data deleted successfully');
      
      // Reload data list
      await loadProjectData();
    } catch (err) {
      setError('Failed to delete data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Project Data Manager</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      
      <form onSubmit={handleSave} className="mb-6">
        <div className="mb-4">
          <label htmlFor="key" className="block text-sm font-medium text-gray-700 mb-1">
            Key
          </label>
          <input
            type="text"
            id="key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter key"
            disabled={loading}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
            Value (JSON or string)
          </label>
          <textarea
            id="value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Enter value (JSON or string)"
            rows={4}
            disabled={loading}
          />
        </div>
        
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Data'}
        </button>
      </form>
      
      <div>
        <h3 className="text-lg font-medium mb-2">Stored Data</h3>
        
        {loading && dataList.length === 0 ? (
          <p>Loading data...</p>
        ) : dataList.length === 0 ? (
          <p className="text-gray-500">No data stored yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Key
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dataList.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.key}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <pre className="max-w-md overflow-auto">
                        {JSON.stringify(item.value, null, 2)}
                      </pre>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => handleDelete(item.key)}
                        className="text-red-600 hover:text-red-900"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 