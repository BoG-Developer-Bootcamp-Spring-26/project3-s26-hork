import React from 'react';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/router';

interface TrainingLogProps {
    //fix
  log: {
    _id: string;
    title: string;
    description: string;
    date: string | number;
    hours: number;
    user: string; 
    animal: string;
  };
}

export default function TrainingLogCard({ log }: TrainingLogProps) {
  const router = useRouter();
  const [yearStr, monthStr, dayStr] = String(log.date).split('T')[0].split('-');
  
  const day = parseInt(dayStr);
  const year = parseInt(yearStr);
  const dateObj = new Date(year, parseInt(monthStr) - 1, day);
  const month = dateObj.toLocaleString('default', { month: 'short' });

  return (
    <div className="flex w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-4 min-h-[120px]">
      
      <div className="bg-[#2D366F] text-white w-24 flex flex-col items-center justify-center py-4 px-2 shrink-0">
        <span className="text-4xl font-bold leading-none">{day}</span>
        <span className="text-[15px] font-medium mt-1 uppercase tracking-tighter leading-tight text-center">
          {month} - {year}
        </span>
      </div>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-baseline gap-2">
            <h3 className="text-xl font-bold text-gray-900">{log.title}</h3>
            <span className="text-gray-400 text-sm italic">• {log.hours} hours</span>
          </div>
          
          <p className="text-gray-400 text-sm mt-1">
            {log.user} - {log.animal}
          </p>
        </div>

        <p className="text-gray-700 text-sm mt-3 leading-relaxed">
          {log.description}
        </p>
      </div>

      <div className="flex items-center pr-6">
        <button 
          className="w-12 h-12 bg-[#C23127] hover:bg-red-700 text-white rounded-full flex items-center justify-center transition-colors shadow-md"
          onClick={() => router.push(`/dashboard/training-logs/${log._id}/edit`)}
        >
          <Pencil size={20} fill="currentColor" />
        </button>
      </div>
    </div>
  );
}
