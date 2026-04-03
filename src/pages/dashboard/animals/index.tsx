import TitleBar from '@/components/Titlebar';
import Sidebar from '@/components/Sidebar';
import { GetServerSidePropsContext } from 'next';
import { getServerSideUser, SessionUser } from '@server/utils/getServerSideUser';

export default function Animals({ user }: { user: SessionUser }) {

  return (
    <div className="flex flex-col h-screen bg-white">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar user={user} />
        <main className="flex-1 flex flex-col bg-white overflow-y-auto">
          <div className="flex items-center px-8 py-6 border-b border-gray-100">
            <h1 className="text-2xl font-semibold text-gray-700">Animals</h1>
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
