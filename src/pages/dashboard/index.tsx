import { useState } from 'react';
import { useRouter } from 'next/router';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import TrainingLogCard from '@/components/TrainingLogCard';
import { PlusSquare } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function Dashboard({ user }: { user: SessionUser }) {
  const router = useRouter();

  const [logs] = useState([
    {
      _id: '1',
      title: 'Complete sit lessons',
      description: 'Lucy finishes the sit lessons very well today. Should give her a treat',
      date: '2026-4-3',
      hours: 20,
      user: 'Jaahnvi Toolsidas',
      animal: 'Golden Retriever - Lucy'
    },
    {
      _id: '2',
      title: 'Complete sit lessons',
      description: 'Lucy finishes the sit lessons very well today. Should give her a treat',
      date: '2026-3-19',
      hours: 20,
      user: 'Jaahnvi Toolsidas',
      animal: 'Golden Retriever - Lucy'
    },
    {
      _id: '3',
      title: 'Complete sit lessons',
      description: 'Lucy finishes the sit lessons very well today. Should give her a treat',
      date: '2026-4-3',
      hours: 20,
      user: 'Jaahnvi Toolsidas',
      animal: 'Golden Retriever - Lucy'
    }
  ]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar />

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
            <div className="space-y-6">
              {logs.map((log) => (
                <TrainingLogCard key={log._id} log={log} />
              ))}
            </div>
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
