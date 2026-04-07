import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import { X } from 'lucide-react';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function CreateTrainingLog({ user }: { user: SessionUser }) {
  const router = useRouter();
  const today = new Date();

  const [title, setTitle] = useState('');
  const [animalId, setAnimalId] = useState('');
  const [hours, setHours] = useState(1);
  const [month, setMonth] = useState(months[today.getMonth()]);
  const [day, setDay] = useState(today.getDate());
  const [year, setYear] = useState(today.getFullYear());
  const [description, setDescription] = useState('');
  const [animals, setAnimals] = useState<{ _id: string; name: string; breed: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/animal')
      .then(r => r.json())
      .then(data => {
        const list = data.animalData || [];
        setAnimals(list);
        if (list.length > 0) setAnimalId(list[0]._id);
      });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const monthIndex = months.indexOf(month);
    const date = new Date(year, monthIndex, day).toISOString();

    setSaving(true);
    try {
      const res = await fetch('/api/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, animal: animalId, hours, date, description }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to save');
      } else {
        router.push('/dashboard');
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
          <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">Training logs</h1>
            <button 
              type="button"
              className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors text-sm font-medium"
            >
              <X size={20} strokeWidth={2.5} />
              <span>Delete log</span>
            </button>
          </div>

          <div className="flex-1 p-10 flex justify-center">
            <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl">

              <div>
                <label className="block text-lg font-bold mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Select Animal</label>
                <div className="relative">
                  <select
                    value={animalId}
                    onChange={e => setAnimalId(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    {animals.length === 0 && <option value="">No animals found</option>}
                    {animals.map(a => (
                      <option key={a._id} value={a._id}>{a.name} - {a.breed}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Total hours trained</label>
                <input
                  type="number"
                  min={0}
                  value={hours}
                  onChange={e => setHours(Number(e.target.value))}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="flex gap-8">
                <div className="flex-3">
                  <label className="block text-lg font-bold mb-2">Month</label>
                  <select
                    value={month}
                    onChange={e => setMonth(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                  >
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div className="flex-1">
                  <label className="block text-lg font-bold mb-2">Date</label>
                  <input
                    type="number"
                    min={1}
                    max={31}
                    value={day}
                    onChange={e => setDay(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-lg font-bold mb-2">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={e => setYear(Number(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Note</label>
                <textarea
                  rows={6}
                  placeholder="Note"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none placeholder-gray-400"
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
