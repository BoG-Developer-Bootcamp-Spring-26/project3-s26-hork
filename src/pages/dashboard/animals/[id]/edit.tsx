import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { X } from 'lucide-react';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function EditAnimal({ user }: { user: SessionUser }) {
  const router = useRouter();
  const { id, returnTo } = router.query;
  const backPath = typeof returnTo === 'string' ? returnTo : '/dashboard/animals';

  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [hoursTrained, setHoursTrained] = useState(0);
  const [month, setMonth] = useState(months[0]);
  const [day, setDay] = useState(1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  async function handleDelete() {
    if (!id || !confirm('Are you sure you want to delete this animal?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/animal?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push(backPath);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete');
      }
    } catch {
      setError('Failed to delete');
    } finally {
      setDeleting(false);
    }
  }

  useEffect(() => {
    if (!id) return;
    fetch(`/api/animal?id=${id}`)
      .then(r => r.json())
      .then(data => {
        const animal = data.animalData;
        if (animal) {
          setName(animal.name || '');
          setBreed(animal.breed || '');
          setHoursTrained(animal.hoursTrained ?? 0);
          setNote(animal.note || '');
          if (animal.birthdate) {
            const d = new Date(animal.birthdate);
            setMonth(months[d.getMonth()]);
            setDay(d.getDate());
            setYear(d.getFullYear());
          }
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const birthdate = new Date(year, months.indexOf(month), day).toISOString();
      const res = await fetch('/api/animal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name, breed, birthdate, note }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || 'Failed to save');
      } else {
        router.push(backPath);
      }
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white font-sans text-[#1A0A08]">
        <TitleBar />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar user={user} />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Loading...</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-[#1A0A08]">
      <TitleBar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />

        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center justify-between px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">Animals</h1>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors text-sm font-medium disabled:opacity-50"
            >
              <X size={20} strokeWidth={2.5} />
              <span>{deleting ? 'Deleting...' : 'Delete animal'}</span>
            </button>
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
                  value={hoursTrained}
                  readOnly
                  disabled
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                />
                <p className="text-xs text-gray-400 mt-1">Calculated automatically from training logs.</p>
              </div>

              <div className="flex gap-8">
                <div className="flex-3">
                  <label className="block text-lg font-bold mb-2">Birth Month</label>
                  <div className="relative">
                    <select
                      value={month}
                      onChange={e => setMonth(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
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
                  rows={5}
                  placeholder="Note"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none placeholder-gray-400"
                />
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}

              <div className="flex gap-6 pt-4">
                <button
                  type="button"
                  onClick={() => router.push(backPath)}
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
