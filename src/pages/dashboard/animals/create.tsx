import React, { useState } from 'react';
import { useRouter } from 'next/router';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function CreateAnimal({ user }: { user: SessionUser }) {
  const router = useRouter();

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [hoursTrained, setHoursTrained] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const res = await fetch('/api/animal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, breed, hoursTrained }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to save');
      } else {
        router.push('/dashboard/animals');
      }
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-[#1A0A08]">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />

        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">Animals</h1>
          </div>

          <div className="flex-1 p-10 flex justify-center">
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl">

              <div>
                <label className="block text-lg font-bold mb-2">Animal Name</label>
                <input
                  type="text"
                  placeholder="Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Breed</label>
                <input
                  type="text"
                  placeholder="Breed"
                  value={breed}
                  onChange={e => setBreed(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Total hours trained</label>
                <input
                  type="number"
                  min={0}
                  value={hoursTrained}
                  onChange={e => setHoursTrained(Number(e.target.value))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-3 border border-[#C23127] text-[#C23127] font-bold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-[#C23127] text-white font-bold rounded-lg hover:bg-[#a62a21] transition-colors disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
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
