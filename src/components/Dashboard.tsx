import { getServerSession } from 'next-auth';
import Channels from './Channels';
import CurrentChat from './CurrentChat';

export default async function Dashboard() {
  const session = await getServerSession();

  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <CurrentChat />
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            <Channels />
          </ul>
        </div>
      </div>
    </>
  );
}
