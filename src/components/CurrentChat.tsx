'use client';

import useChannel from '@/context/ChannelProvider';
import { ChannelDocument } from '@/models/Channel';
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

  return (
    <div className="w-full h-full flex flex-col items-center justify-between">
      <div className="flex justify-center w-full">
        {channel.channel?.users?.map(
          (user) =>
            session.data?.user &&
            session.data.user.id !== user._id && (
              <kbd key={user._id} className="kbd">
                {user.username}
              </kbd>
            )
        )}
      </div>

      {channel.channel?.messages?.map((message) => (
        <div key={message._id} className={`chat ${message.author._id === session.data?.user.id ? 'chat-end' : 'chat-start'}`}>
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src={message.author.image || '/default.png'} alt={`Avatar of ${message.author.username}`} height={10} width={10} />
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
