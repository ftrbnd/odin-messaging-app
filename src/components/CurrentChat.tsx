'use client';

import useChannel from '@/context/ChannelProvider';
import { useSession } from 'next-auth/react';

export default function CurrentChat() {
  const channel = useChannel();
  const session = useSession();

  return (
    <div className="w-full h-full flex justify-center items-start">
      {channel.channel.users?.map(
        (user) =>
          session.data?.user &&
          session.data.user.id !== user._id && (
            <kbd key={user._id} className="kbd">
              {user.username}
            </kbd>
          )
      )}
    </div>
  );
}
