'use client';

import useChannel from '@/context/ChannelProvider';

export default function CurrentChat() {
  const channel = useChannel();

  return (
    <div>
      <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
        Open drawer
      </label>
      <p>Current Chat</p>
    </div>
  );
}
