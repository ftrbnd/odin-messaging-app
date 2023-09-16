'use client';

import useChannel from '@/context/ChannelProvider';
import { useSession } from 'next-auth/react';
import { FormEvent, useState } from 'react';

export default function CurrentChat() {
  const [textInput, setTextInput] = useState('');

  const channel = useChannel();
  const session = useSession();

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!textInput || !textInput.trim()) return setTextInput('');

    console.log(`"${textInput}"`);
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-between">
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
