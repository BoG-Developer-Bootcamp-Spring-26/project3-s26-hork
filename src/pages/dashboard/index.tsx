import { useState } from 'react';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';

export default function Dashboard() {
  //fix this!
  const [user] = useState({
    fullName: 'Jaahnvi Toolsidas',
    admin: true,
  });

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />

        <main className="flex-1 flex items-center justify-center bg-gray-50 p-6 overflow-y-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Dashboard</h1>
            <p className="text-gray-500 text-lg">Coming soon.</p>
          </div>
        </main>
      </div>
    </div>
  );
}