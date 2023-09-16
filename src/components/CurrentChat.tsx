'use client';

import useChannel from '@/context/ChannelProvider';
import { ChannelDocument } from '@/models/Channel';
import { UserDocument } from '@/models/User';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FormEvent, useState } from 'react';

export default function CurrentChat() {
  const [textInput, setTextInput] = useState('');

  const channel = useChannel();
  const session = useSession();

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!textInput || !textInput.trim()) return setTextInput('');

    try {
      const res = await fetch('http://localhost:3000/api/messages/new', {
        method: 'POST',
        body: JSON.stringify({ text: textInput, channelId: channel.channel?._id })
      });

      const { channel: channelCreated }: { channel: ChannelDocument } = await res.json();

      channel.setChannel(channelCreated);
      setTextInput('');
    } catch (err) {
      console.error('Fail sending message: ', err);
    }
  };

  const manageFriend = async (user: UserDocument) => {
    console.log('FRIEND?: ', user);

    try {
      const res = await fetch(`http://localhost:3000/api/users/${user._id}`, {
        method: 'POST',
        body: JSON.stringify({ adding: !user.friends?.find((f) => f._id === session.data?.user.id) })
      });

      const data = await res.json();
      console.log(data);

      channel.refetch();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <div className="flex justify-center w-full">
        {channel.channel?.users?.map(
          (user) =>
            session.data?.user &&
            session.data.user.id !== user._id && (
              <div key={user._id} className="dropdown dropdown-hover">
                <kbd tabIndex={0} className="kbd hover:cursor-pointer hover:bg-primary">
                  {user.username}
                </kbd>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li onClick={() => manageFriend(user)}>
                    <a>{user.friends?.find((f) => f._id === session.data.user.id) ? 'Remove Friend' : 'Add Friend'}</a>
                  </li>
                </ul>
              </div>
            )
        )}
      </div>

      <div className="h-full w-full flex flex-col">
        {channel.channel?.messages?.map((message) => (
          <div key={message._id} className={`chat ${message.author._id === session.data?.user.id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image src={message.author.image || '/default.png'} alt={`Avatar of ${message.author.username}`} height={100} width={100} />
              </div>
            </div>
            <div className="chat-bubble">{message.text}</div>
            <div className="chat-footer opacity-50">
              <time className="text-xs opacity-50">
                {new Date(`${message.createdAt}`).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </time>
            </div>
          </div>
        ))}
      </div>

      {channel.channel && (
        <form onSubmit={(e) => sendMessage(e)} className="w-full flex justify-between items-stretch gap-2 p-2">
          <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
          <button onClick={sendMessage} className="btn btn-primary">
            Send
          </button>
        </form>
      )}
    </div>
  );
}
