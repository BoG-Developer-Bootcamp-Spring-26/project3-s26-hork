import TitleBar from '@/components/Titlebar';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <TitleBar />
      <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-500 text-sm">Coming soon.</p>
      </div>
      </div>
    </div>
  );
}
