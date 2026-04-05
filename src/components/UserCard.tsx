/*import React from 'react';

interface UserCardProps {
  fullName: string;
  role: string;
}

export default function UserCard({ fullName, role }: UserCardProps) {
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-[18px] shadow-[0_2px_15px_rgba(0,0,0,0.07)] border border-gray-50 transition-transform hover:scale-[1.01]">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#C23127] text-white font-bold text-xl shrink-0">
        {initial}
      </div>

      <div className="flex flex-col min-w-0">
        <span className="text-[18px] font-bold text-gray-900 leading-tight">
          {fullName}
        </span>
        <div className="flex items-center text-[14px] font-medium text-gray-400 mt-0.5">
          <span>{role}</span>
        </div>
      </div>
    </div>
  );
}*/

import React from 'react';
import { X } from 'lucide-react';

interface UserCardProps {
  fullName: string;
  role: string;
  onDelete?: () => void; //fix
}

export default function UserCard({ fullName, role, onDelete }: UserCardProps) {
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-4 p-5 bg-white rounded-[18px] shadow-[0_2px_15px_rgba(0,0,0,0.07)] border border-gray-50 transition-transform hover:scale-[1.01] relative group">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#C23127] text-white font-bold text-xl shrink-0">
        {initial}
      </div>

      <div className="flex flex-col min-w-0 flex-1">
        <span className="text-[18px] font-bold text-gray-900 leading-tight">
          {fullName}
        </span>
        <div className="flex items-center text-[14px] font-medium text-gray-400 mt-0.5">
          <span>{role}</span>
        </div>
      </div>

      <button 
        onClick={onDelete}
        className="text-gray-300 hover:text-red-500 transition-colors p-1"
        aria-label="Delete user"
      >
        <X size={20} strokeWidth={2.5} />
      </button>
    </div>
  );
}