import { useState, useEffect } from 'react';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import TrainingLogCard from '@/components/TrainingLogCard';

export default function AllTraining() {
  const [user] = useState({
    fullName: 'Jaahnvi Toolsidas',
    admin: true,
  });

  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllLogs() {
      try {
        const response = await fetch('/api/admin/training'); 
        const data = await response.json();
        
        if (response.ok) {
          setAllLogs(data.trainingLogData || []);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAllLogs();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />

        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">All training logs</h1>
          </div>

          <div className="p-8 max-w-5xl w-full">
            {loading ? (
              <p className="text-gray-500">Loading all logs...</p>
            ) : allLogs.length > 0 ? (
              <div className="space-y-6">
                {allLogs.map((log: any) => (
                  <TrainingLogCard key={log._id} log={log} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400">No training logs found in the system.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}