import { useEffect, useState } from 'react';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import TrainingLogCard from '@/components/TrainingLogCard';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function TrainingLogs({ user }: { user: SessionUser }) {
  const [logs, setLogs] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/training')
      .then((res) => res.json())
      .then((data) => setLogs(data.trainingLogData ?? []));
  }, []);

  const filtered = query
    ? logs.filter((log) => log.title?.toLowerCase().includes(query.toLowerCase()))
    : logs;

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar searchValue={query} onSearchChange={setQuery} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">Training logs</h1>
          </div>
          <div className="p-8 max-w-5xl w-full">
            {filtered.length > 0 ? (
              <div className="space-y-6">
                {filtered.map((log: any) => (
                  <TrainingLogCard key={log._id} log={log} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-gray-100 rounded-xl">
                <p className="text-gray-400">No training logs found.</p>
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
