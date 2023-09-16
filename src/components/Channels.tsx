'use client';

import useChannel from '@/context/ChannelProvider';
import { ChannelDocument } from '@/models/Channel';
import { UserDocument } from '@/models/User';
import { useSession } from 'next-auth/react';
import { FormEvent, useEffect, useState } from 'react';

export default function Dashboard() {
  const [channels, setChannels] = useState<ChannelDocument[]>([]);

  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<UserDocument[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const channel = useChannel();
  const session = useSession();

  useEffect(() => {
    const getChannels = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/channels`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch channels.');
        }

        const data = res.json();
        return data;
      } catch (err: any) {
        console.error(err.message);
        return { channels: [] };
      }
    };

    if (session.data?.user) {
      getChannels().then((data) => {
        setChannels(data.channels);
      });
    }
  }, [session.data?.user]);

  const openModal = () => {
    const modal = document.getElementById('new_chat_modal')! as any;
    modal.showModal();
  };

  const closeModal = () => {
    const modal = document.getElementById('new_chat_modal')! as any;
    modal.close();
  };

  const createNewChannel = async (user: UserDocument) => {
    // TODO: Create api route to create new channels
    try {
      const res = await fetch(`http://localhost:3000/api/channels/new`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newUser: user })
      });
    } catch (err) {
      console.error(err);
    } finally {
      closeModal();
    }
  };

  const searchInputs = async (e: FormEvent) => {
    e.preventDefault();

    if (!searchInput || !searchInput.trim()) return;
    setSearchLoading(true);

    try {
      // TODO: filter search results by input text
      // TODO: limit users to 5 and populate only username and avatar
      const res = await fetch(`http://localhost:3000/api/users?search=${searchInput}`);
      if (!res.ok) throw new Error(`Failed to search for "${searchInput}"`);

      const data = await res.json();

      setSearchResults(data.users);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  const getChannelTitle = (channel: ChannelDocument): string => {
    if (!channel.users || !session.data?.user) return '';

    if (channel.channelType === 'DM') {
      // return name of other user
      return channel.users[0]._id === session.data.user.id ? channel.users[1].username : channel.users[0].username;
    } else if (channel.channelType === 'GROUP') {
      // return 'name, name, ...'
      let users: string[] = [];
      for (let i = 0; i < channel.users.length; i++) {
        if (channel.users[i]._id !== session.data.user.id) {
          users.push(channel.users[i].username);
        }
        if (users.length > 2) break;
      }
      return users.join(', ').concat('...');
    }
  };

  const handleChannelClick = (ch: ChannelDocument) => {
    channel.setChannel(ch);
  };

  return (
    <div>
      <div className="flex justify-between h-full items-center">
        <h2 className="text-lg font-bold text-center">Chats</h2>
        <button className="btn btn-outline btn-primary" onClick={openModal}>
          New
        </button>
        <dialog id="new_chat_modal" className="modal sm:modal-middle" onClose={() => setSearchResults([])}>
          <div className="modal-box flex flex-col gap-1">
            <h3 className="font-bold text-lg">New Chat</h3>

            <div className="dropdown flex flex-col gap-2">
              <form onSubmit={(e) => searchInputs(e)} className="flex justify-between">
                <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} type="text" placeholder="Another user" className="input input-bordered w-full max-w-xs" />
                <button className={`btn btn-outline btn-primary ${searchLoading && 'btn-disabled'}`} onClick={searchInputs}>
                  {searchLoading ? 'Searching...' : 'Search'}
                </button>
              </form>

              <ul>
                {searchResults.map((result: UserDocument) => (
                  <li key={result._id} onClick={() => createNewChannel(result)}>
                    {session.data?.user && result._id !== session.data?.user.id && <a>{result.username}</a>}
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
      <ul className="menu bg-base-200 w-56 rounded-box">
        {channels.map((ch: ChannelDocument) => (
          <li key={ch._id} onClick={() => handleChannelClick(ch)}>
            <a className={ch._id === channel.channel?._id ? 'active' : ''}>{getChannelTitle(ch)}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}
