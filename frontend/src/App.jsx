import React, { useState } from 'react';

// Simple version without lucide-react icons if you want to test quickly
export default function CharacterCounter() {
  const [name, setName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '/api';

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BACKEND_URL}/count`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error('Error calling backend:', err);
      setError('Failed to connect to backend service');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4 text-sm text-gray-600">
          <div className="font-semibold text-gray-800 mb-2">Pod Architecture</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Frontend Pod: NodePort (Port 3000)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Backend Pod: ClusterIP (Port 3001)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Character Counter
            </h1>
            <p className="text-gray-600">
              Enter your name to count characters
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || !name.trim()}
                className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
              >
                {loading ? 'Connecting...' : 'Count'}
              </button>
              {result && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {result && (
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border-2 border-indigo-200">
              <div className="text-center">
                <div className="text-sm font-medium text-indigo-600 mb-2">
                  Result from Backend
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  "{result.name}"
                </div>
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {result.charCount}
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {result.charCount === 1 ? 'character' : 'characters'}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-indigo-200">
                <div className="text-center text-xs text-gray-500">
                  Backend Pod: {result.backend || 'backend-service'}
                </div>
                {result.timestamp && (
                  <div className="text-center text-xs text-gray-400 mt-1">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
