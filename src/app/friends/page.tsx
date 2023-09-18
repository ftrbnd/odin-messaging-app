'use client';

import useChannel from '@/context/ChannelProvider';
import useFriends from '@/context/FriendsProvider';
import { UserDocument } from '@/models/User';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Friends() {
  const [friendLoading, setFriendLoading] = useState(false);
  const [error, setError] = useState('');

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<UserDocument[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const friends = useFriends();
  const channel = useChannel();
  const router = useRouter();
  const session = useSession();

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

      router.push('/');
      router.refresh();
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

  const searchForUsers = async (e: FormEvent) => {
    e.preventDefault();

    if (!searchInput || !searchInput.trim()) return;
    setSearchLoading(true);

    try {
      const res = await fetch(`http://localhost:3000/api/users?search=${searchInput}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error(`Failed to search for "${searchInput}"`);

      const { users }: { users: UserDocument[] } = await res.json();

      setSearchResults(users);
    } catch (err) {
      console.error(err);
      setError(`Could not search for "${searchInput}"`);
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center gap-2 px-6 py-12 lg:px-8 bg-base-200">
      <h1 className="text-2xl text-center">Your Friends</h1>
      <ul className="menu bg-base-200 w-full rounded-box gap-2">
        {friends.friends?.length ? (
          friends.friends?.map((friend: UserDocument) => (
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
          ))
        ) : session.data?.user ? (
          <div className="dropdown flex flex-col gap-2 items-center">
            <form onSubmit={(e) => searchForUsers(e)} className="flex justify-between gap-2">
              <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" placeholder="Search for user" className="input input-bordered w-full max-w-xs" />
              <button className={`btn btn-outline btn-primary ${searchLoading && 'btn-disabled'}`} onClick={searchForUsers}>
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </form>

            <ul className="flex flex-col gap-2  w-full max-w-xs">
              {searchResults.map(
                (result: UserDocument) =>
                  session.data?.user &&
                  result._id !== session.data?.user.id && (
                    <li key={result._id} onClick={() => handleFriendClick(result)}>
                      <div className="flex flex-row">
                        {result.image ? (
                          <div className="avatar">
                            <div className="w-8 rounded-full">
                              <Image src={result.image} alt={`Avatar of ${result.username}`} height={8} width={8} />
                            </div>
                          </div>
                        ) : (
                          <div className="avatar placeholder">
                            <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                              <span className="text-xs">{result.username[0].toUpperCase()}</span>
                            </div>
                          </div>
                        )}
                        <a>{result.username}</a>
                      </div>
                    </li>
                  )
              )}
            </ul>
          </div>
        ) : (
          <Link className="self-center" href={'/signin'}>
            <button className={'btn btn-outline btn-secondary'}>Sign In</button>
          </Link>
        )}
      </ul>

      {error && (
        <div className="toast toast-top toast-end">
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
