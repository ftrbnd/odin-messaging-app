'use client';

import useChannel from '@/context/ChannelProvider';
import useFriends from '@/context/FriendsProvider';
import { UserDocument } from '@/models/User';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Friends() {
  const [friendLoading, setFriendLoading] = useState(false);
  const [error, setError] = useState('');

  const friends = useFriends();
  const channel = useChannel();
  const router = useRouter();

  const handleFriendClick = async (friend: UserDocument) => {
    if (!friend._id) return;

    try {
      const res = await fetch(`http://localhost:3000/api/channels?friendId=${friend._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to open friend channel.');

      const { channel: dmChannel } = await res.json();
      channel.setChannel(dmChannel);
      console.log(dmChannel);

      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Could not open DM channel.');
    }
  };

  const removeFriend = async (friend: UserDocument) => {
    try {
      setFriendLoading(true);

      const res = await fetch(`http://localhost:3000/api/users/${friend._id}`, {
        method: 'POST',
        body: JSON.stringify({ adding: false })
      });

      if (!res.ok) throw new Error('Failed to remove friend.');

      friends.refetch();
      channel.refetch();
    } catch (err) {
      console.error(err);
      setError('Could not remove friend.');
    } finally {
      setFriendLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center gap-2 px-6 py-12 lg:px-8 bg-base-200">
      <h1 className="text-2xl text-center">Your Friends</h1>
      <ul className="menu bg-base-200 w-full rounded-box gap-2">
        {friends.friends?.map((friend: UserDocument) => (
          <div key={friend._id} className="flex justify-between items-center gap-2 p-2">
            <li onClick={() => handleFriendClick(friend)} className="flex-1">
              <a className="flex flex-row justify-start items-center gap-4">
                {friend.image ? (
                  <div className="avatar">
                    <div className="w-24 rounded-full">
                      <Image src={friend.image} alt={`Avatar of ${friend.username}`} height={24} width={24} />
                    </div>
                  </div>
                ) : (
                  <div className="avatar placeholder">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                      <span className="text-lg">{friend.username[0].toUpperCase()}</span>
                    </div>
                  </div>
                )}
                <p>{friend.username}</p>
              </a>
            </li>
            <div className="tooltip tooltip-left" data-tip="Remove Friend">
              <button className={`btn btn-square ${friendLoading && 'btn-disabled'}`} onClick={() => removeFriend(friend)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </ul>

      {error && (
        <div className="toast toast-end">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
