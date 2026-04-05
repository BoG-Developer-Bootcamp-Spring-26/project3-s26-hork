import React from 'react';
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function CreateAnimal({ user }: { user: SessionUser }) {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.toLocaleString('default', { month: 'long' });
  const currentYear = today.getFullYear();

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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
            <form className="space-y-6 w-full max-w-4xl">

              <div>
                <label className="block text-lg font-bold mb-2">Animal Name</label>
                <input 
                  type="text" 
                  placeholder="Name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Breed</label>
                <input 
                  type="text" 
                  placeholder="Breed"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Total hours trained</label>
                <input 
                  type="number" 
                  defaultValue={100}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="flex gap-8">
                <div className="flex-[3]">
                  <label className="block text-lg font-bold mb-2">Birth Month</label>
                  <div className="relative">
                    <select 
                      defaultValue={currentMonth}
                      className="w-full p-3 border border-gray-300 rounded-lg bg-white appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-gray-400"
                    >
                      {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-lg font-bold mb-2">Date</label>
                  <input 
                    type="number" 
                    defaultValue={currentDay}
                    className="w-full p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>

                <div className="flex-1">
                  <label className="block text-lg font-bold mb-2">Year</label>
                  <input 
                    type="number" 
                    defaultValue={currentYear}
                    className="w-full p-3 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-1 focus:ring-gray-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-lg font-bold mb-2">Note</label>
                <textarea 
                  rows={6}
                  placeholder="Note"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none placeholder-gray-400"
                />
              </div>

              <div className="flex gap-6 pt-4">
                <button 
                  type="button"
                  className="flex-1 py-3 border border-[#C23127] text-[#C23127] font-bold rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-[#C23127] text-white font-bold rounded-lg hover:bg-[#a62a21] transition-colors"
                >
                  Save
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