import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import AnimalCard from '@/components/AnimalCard';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';
import { AnimalData } from '@server/mongodb/types/types';

type Animal = AnimalData & { _id: string };

export default function Animals({ user }: { user: SessionUser }) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!user.admin) {
      const timeout = setTimeout(() => router.back(), 2500);
      return () => clearTimeout(timeout);
    }
    fetch('/api/admin/animals')
      .then((res) => res.json())
      .then((data) => setAnimals(data.animalData ?? []));
  }, [user.admin]);

  const filtered = query
    ? animals.filter((a) => a.name.toLowerCase().includes(query.toLowerCase()))
    : animals;

  if (!user.admin) {
    return (
      <div className="flex flex-col h-screen bg-white">
        <TitleBar hideSearch />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar user={user} />
          <main className="flex-1 flex flex-col items-center justify-center gap-2">
            <p className="text-xl font-semibold text-gray-800">You are not an admin and cannot access this page.</p>
            <p className="text-sm text-gray-400">Redirecting you back...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar searchValue={query} onSearchChange={setQuery} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700 font-sans tracking-tight">
              All animals
            </h1>
          </div>

          <div className="p-10 bg-gray-50/30 flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 max-w-6xl mx-auto">
              {filtered.map((animal) => (
                <AnimalCard
                  key={animal._id}
                  animal={animal}
                />
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
