import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import UserCard from '@/components/UserCard';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function AllUsers({ user }: { user: SessionUser }) {
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!user.admin) {
      const timeout = setTimeout(() => router.back(), 2500);
      return () => clearTimeout(timeout);
    }
    fetch('/api/admin/users')
      .then((res) => res.json())
      .then((data) => setUsers(data.userData ?? []));
  }, [user.admin]);

  const filtered = query
    ? users.filter((u) => u.fullName?.toLowerCase().includes(query.toLowerCase()))
    : users;

  if (!user.admin) {
    return (
      <div className="flex flex-col h-screen bg-white font-sans">
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
    <div className="flex flex-col h-screen bg-white font-sans">
      <TitleBar searchValue={query} onSearchChange={setQuery} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user}/>
        
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-600">All users</h1>
          </div>

          <div className="p-10 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-w-7xl">
              {filtered.map((user) => (
                <UserCard
                  key={user._id}
                  fullName={user.fullName}
                  role={user.admin ? 'Admin' : 'User'}
                  onDelete={async () => {
                    await fetch(`/api/admin/users?id=${user._id}`, { method: 'DELETE' });
                    setUsers((prev) => prev.filter((x) => x._id !== user._id));
                  }}
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
