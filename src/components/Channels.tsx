'use client';

import useChannel from '@/context/ChannelProvider';
import { Channel } from '@/types/channel-d';
import { User } from '@/types/user-d';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';

const emptyChannel: Channel = {
  id: '-1',
  name: 'default',
  channelType: 'dm'
};

export default function Dashboard() {
  const [channels, setChannels] = useState<Channel[]>([emptyChannel]);

  const [searchUser, setSearchUser] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const channel = useChannel();
  const session = useSession();

  useEffect(() => {
    const getChannels = async (id: string) => {
      const res = await fetch(`http://localhost:3000/api/users/${id}/channels`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = res.json();
      return data;
    };

    if (session.data?.user) {
      getChannels(session.data?.user.id).then((data) => {
        console.log(data.channels);
        setChannels(data.channels);
      });
    }
  }, [session.data?.user]);

  const closeModal = () => {
    const modal = document.getElementById('new_chat_modal')! as any;
    modal.showModal();
  };

  const createNewChannel = async (user: User) => {
    console.log('Creating new chat with user...', user);

    // TODO: Create api route to create new channels
    const res = await fetch(`http://localhost:3000/users/${user.id}/channels/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  };

  const searchUsers = async (e: FormEvent) => {
    e.preventDefault();
    setSearchLoading(true);

    // TODO: limit users to 5 and populate only username and avatar
    const res = await fetch('http://localhost:3000/api/users');
    const data = await res.json();

    setSearchResults(data.users);
    setSearchLoading(false);
  };

  return (
    <div>
      <div className="flex justify-between h-full items-center">
        <h2 className="text-lg font-bold text-center">Chats</h2>
        <button className="btn btn-outline btn-primary" onClick={closeModal}>
          New
        </button>
        <dialog id="new_chat_modal" className="modal sm:modal-middle" onClose={() => setSearchResults([])}>
          <div className="modal-box flex flex-col gap-1">
            <h3 className="font-bold text-lg">New Chat</h3>

            <div className="dropdown flex flex-col gap-2">
              <form onSubmit={(e) => searchUsers(e)} className="flex justify-between">
                <input value={searchUser} onChange={(e) => setSearchUser(e.target.value)} type="text" placeholder="Another user" className="input input-bordered w-full max-w-xs" />
                <button className={`btn btn-outline btn-primary ${searchLoading && 'btn-disabled'}`} onClick={searchUsers}>
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </form>

              <ul>
                {searchResults.map((result: User) => (
                  <li key={result.id} onClick={() => createNewChannel(result)}>
                    <a>{result.username}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>

      <div className="divider"></div>
      {channels.map((ch) => (
        <li onClick={() => channel.setChannel(ch)} key={ch.id}>
          {ch.name}
        </li>
      ))}
    </div>
  );
}
