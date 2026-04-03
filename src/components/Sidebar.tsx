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

  const handleLogout = () => {
    //uuhhh figure this out later
    router.push('/');
  };

  const NavItem = ({ href, icon: Icon, label, active = false }: any) => (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
      active 
        ? 'bg-[#C23127] text-white' 
        : 'text-gray-600 hover:bg-gray-100'
    }`}>
      <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      <span className="font-medium text-[17px]">{label}</span>
    </Link>
  );

  return (
    <aside className="w-72 h-full bg-white border-r border-gray-200 flex flex-col p-4">
      <nav className="flex-1 space-y-2">
        <NavItem 
          href="/dashboard" 
          icon={Pencil} 
          label="Training logs" 
          active={router.pathname === '/dashboard'} 
        />
        <NavItem href="/animals" icon={Bone} label="Animals" />

        {user.admin && (
          <div className="mt-8">
            <div className="border-t border-gray-200 mb-6" />
            <h3 className="px-4 text-gray-500 font-bold text-lg mb-4">Admin access</h3>
            <div className="space-y-2">
              <NavItem 
                href="/dashboard/all-training-logs" 
                icon={Folder} 
                label="All training" 
                active={router.pathname === '/dashboard/all-training-logs'} 
              />
              <NavItem href="/admin/animals" icon={Rabbit} label="All animals" />
              <NavItem href="/admin/users" icon={Users} label="All users" />
            </div>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#C23127] rounded-full flex items-center justify-center text-white text-xl font-bold">
              {user.fullName.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 leading-tight">
                {user.fullName}
              </span>
              <span className="text-gray-500 text-sm">
                {user.admin ? 'Admin' : 'User'}
              </span>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Logout"
          >
            <LogOut size={24} />
          </button>
        </div>
      </div>
    </aside>
  );
}