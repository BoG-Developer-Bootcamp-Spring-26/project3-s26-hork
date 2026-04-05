/*import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function AllUsers({ user }: { user: SessionUser }) {

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar/>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user}/>
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">All users</h1>
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
} */
import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import UserCard from '@/components/UserCard';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function AllUsers({ user }: { user: SessionUser }) {
  return (
    <div className="flex flex-col h-screen bg-white font-sans">
      <TitleBar/>
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user}/>
        
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="px-10 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-600">All users</h1>
          </div>

          <div className="p-10 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6 max-w-7xl">
              {/* row 1 */}
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              
              {/* row 2 */}
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              
              {/* row 3 */}
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              
              {/* row 4 */}
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
              <UserCard fullName="Jaahnvi Toolsidas" role="Admin"/>
            </div>
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