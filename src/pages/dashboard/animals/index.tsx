/**import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function Animals({ user }: { user: SessionUser }) {

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">Animals</h1>
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
} **/

import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import AnimalCard from '@/components/AnimalCard';
import { PlusSquare } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function Animals({ user }: { user: SessionUser }) {
  const mockAnimals = Array(6).fill({
    _id: '1',
    name: 'Lucy',
    breed: 'Golden Retriever',
    owner: 'Jaahnvi Toolsidas',
    hoursTrained: 100,
    profilePicture: '/images/animalPicture.png'
  });
  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700 font-sans">Animals</h1>
            <button className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors">
              <PlusSquare size={20} strokeWidth={1.5} />
              <span className="text-sm font-medium">Create new</span>
              </button>
              </div>
              <div className="p-10 bg-gray-50/30 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-6xl mx-auto">
                {mockAnimals.map((animal, index) => (
                  <AnimalCard key={index} animal={animal} /> 
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