import { getServerSession } from 'next-auth';
import Channels from './Channels';
import CurrentChat from './CurrentChat';

export default async function Dashboard() {
  const session = await getServerSession();

  return (
    <div className="drawer lg:drawer-open h-full">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center h-full">
        {/* Page content here */}
        <CurrentChat />
      </div>
      <div className="drawer-side h-full">
        <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <Channels />
        </div>
      </div>
    </div>
  );
}
