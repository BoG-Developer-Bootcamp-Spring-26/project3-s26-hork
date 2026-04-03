import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Pencil, 
  Bone, 
  Folder, 
  Rabbit, 
  Users, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  user: {
    fullName: string;
    admin: boolean;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/?logout=true');
  };

  const NavItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
      active 
        ? 'bg-[#C23127] text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}>
      <Icon size={20} strokeWidth={active ? 2.5 : 2} className="shrink-0" />
      <span className="font-medium text-sm xl:text-base truncate">{label}</span>
    </Link>
  );

  return (
    <aside className="shrink-0 w-[15%] min-w-[180px] max-w-[260px] h-full bg-white border-r border-gray-200 flex flex-col p-3 overflow-y-auto">
      <nav className="flex-1 space-y-1">
        <NavItem 
          href="/dashboard" 
          icon={Pencil} 
          label="Training logs" 
          active={router.pathname === '/dashboard' || router.pathname.startsWith('/dashboard/training-logs')} 
        />
        <NavItem 
          href="/dashboard/animals" 
          icon={Bone} 
          label="Animals" 
          active={router.pathname.startsWith('/dashboard/animals')}
        />

        {user.admin && (
          <div className="mt-6">
            <div className="border-t border-gray-200 mb-4" />
            <h3 className="px-3 text-gray-500 font-bold text-sm mb-3">Admin access</h3>
            <div className="space-y-1">
              <NavItem 
                href="/dashboard/all-training-logs" 
                icon={Folder} 
                label="All training" 
                active={router.pathname === '/dashboard/all-training-logs'} 
              />
              <NavItem 
                href="/dashboard/all-animals" 
                icon={Rabbit} 
                label="All animals" 
                active={router.pathname === '/dashboard/all-animals'}
              />
              <NavItem 
                href="/dashboard/all-users" 
                icon={Users} 
                label="All users" 
                active={router.pathname === '/dashboard/all-users'}
              />
            </div>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 shrink-0 bg-[#C23127] rounded-full flex items-center justify-center text-white font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-gray-800 text-sm leading-tight truncate">
                {user.fullName}
              </span>
              <span className="text-gray-500 text-xs">
                {user.admin ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-1.5 shrink-0 text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </aside>
  );
}
