import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import TrainingLogCard from '@/components/TrainingLogCard';
import { PlusSquare } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function Dashboard({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  useEffect(() => {
    async function fetchLogs() {
      try {
        const response = await fetch('/api/training');
        const data = await response.json();
        if (response.ok) {
          setLogs(data.trainingLogData || []);
        }
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLogs();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar searchValue={query} onSearchChange={setQuery} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />


        <main className="flex-1 flenpm x flex-col bg-white overflow-y-auto">
          
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">Training logs</h1>
            
            <button 
              onClick={() => router.push('/dashboard/training-logs/create')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              <PlusSquare size={20} />
              Create new
            </button>
          </div>

          <div className="p-8 max-w-5xl">
            {loading ? (
              <p className="text-gray-500">Loading training logs...</p>
            ) : logs.length > 0 ? (
              <div className="space-y-6">
                {(query ? logs.filter((log: any) => log.title?.toLowerCase().includes(query.toLowerCase())) : logs).map((log: any) => (
                  <TrainingLogCard
                    key={log._id}
                    log={log}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400">No training logs yet.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const result = await getServerSideUser(context);
  if (!('user' in result)) return result;
  return { props: { user: result.user } };
}
