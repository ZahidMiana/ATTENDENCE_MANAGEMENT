import { useState, useEffect } from 'react';
import './App.css';

interface SystemData {
  data?: {
    departments?: number;
    classes?: number;
    students?: number;
    blockchains?: number;
  };
}

function App() {
  const [systemData, setSystemData] = useState<SystemData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemData();
  }, []);

  const fetchSystemData = async () => {
    try {
      const apiUrl = import.meta.env.PROD ? '/api' : 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/system/info`);
      const data = await response.json();
      setSystemData(data);
    } catch (error) {
      console.error('Error fetching system data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            🔗 Blockchain Attendance Management System
          </h1>
          <p className="text-gray-300 text-lg">
            Multi-layered Blockchain-Based Attendance Tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">Departments</h3>
            <p className="text-3xl font-bold text-blue-400">
              {systemData?.data?.departments || 0}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">Classes</h3>
            <p className="text-3xl font-bold text-green-400">
              {systemData?.data?.classes || 0}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">Students</h3>
            <p className="text-3xl font-bold text-purple-400">
              {systemData?.data?.students || 0}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-white text-lg font-semibold mb-2">Blockchains</h3>
            <p className="text-3xl font-bold text-yellow-400">
              {systemData?.data?.blockchains || 0}
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-white text-2xl font-bold mb-4">System Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Multi-layered Blockchain Architecture</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">SHA-256 Hashing Algorithm</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Proof of Work Mining</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Immutable Attendance Records</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Real-time Validation</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300">Hierarchical Chain Structure</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-400">
            🚀 Deployed on Vercel | Built with React, Node.js & Express
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;