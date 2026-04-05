import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import AnimalCard from '@/components/AnimalCard';
import { PlusSquare } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';
import { AnimalData } from '@server/mongodb/types/types';

type Animal = AnimalData & { _id: string };

export default function Animals({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch('/api/animal')
      .then((res) => res.json())
      .then((data) => setAnimals(data.animalData ?? []));
  }, []);

  const filtered = query
    ? animals.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : animals;

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar searchValue={query} onSearchChange={setQuery} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700 font-sans">Animals</h1>
            <button 
              onClick={() => router.push('/dashboard/animals/create')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium">
              <PlusSquare size={20} />
              Create new
            </button>
              </div>
              <div className="p-10 bg-gray-50/30 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-6xl mx-auto">
                {filtered.map((animal) => (
                  <AnimalCard key={animal._id} animal={animal} />
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
