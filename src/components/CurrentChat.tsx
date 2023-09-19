'use client';

import useChannel from '@/context/ChannelProvider';
import useFriends from '@/context/FriendsProvider';
import { ChannelDocument } from '@/models/Channel';
import { UserDocument } from '@/models/User';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const imageMimeType = /image\/(png|jpg|jpeg)/i;

export default function CurrentChat() {
  const [textInput, setTextInput] = useState('');
  const [fileDataURL, setFileDataURL] = useState('');

  const [sendLoading, setSendLoading] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);
  const [error, setError] = useState('');

  const channel = useChannel();
  const friends = useFriends();
  const session = useSession();

  const manageFriend = async (user: UserDocument) => {
    try {
      setFriendLoading(true);

      const res = await fetch(`/api/users/${user._id}`, {
        method: 'POST',
        body: JSON.stringify({ adding: !user.friends?.find((f) => f._id === session.data?.user.id) })
      });

      if (!res.ok) throw new Error('Failed to edit friend.');

      friends.refetch();
      channel.refetch();
    } catch (err) {
      console.error(err);
      setError('Could not edit friend.');
    } finally {
      setFriendLoading(false);
    }
  };

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if ((!textInput || !textInput.trim()) && !fileDataURL) return setTextInput('');

    try {
      setSendLoading(true);

      if (fileDataURL) {
        console.log('Message contains an image');
      }

      const res = await fetch('/api/messages/new', {
        method: 'POST',
        body: JSON.stringify({ text: textInput, channelId: channel.channel?._id })
      });

      if (!res.ok) throw new Error('Failed to send message.');

      const { channel: channelCreated }: { channel: ChannelDocument } = await res.json();

      channel.setChannel(channelCreated);
      setTextInput('');
      setFileDataURL('');
    } catch (err) {
      console.error(err);
      setError('Could not send message.');
    } finally {
      setSendLoading(false);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      const file = e.target.files[0];

      if (!file.type.match(imageMimeType)) {
        return alert('Image mime type is not valid');
      } else if (file.size > 5 * 1024 * 1000) {
        return alert('Image cannot be over 5MB');
      }

      const fileReader = new FileReader();

      fileReader.onload = () => {
        setFileDataURL(fileReader.result as string);
      };
      fileReader.readAsDataURL(file);
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
                    {friendLoading ? <span className="loading loading-spinner loading-md"></span> : <a>{user.friends?.find((f) => f._id === session.data.user.id) ? 'Remove Friend' : 'Add Friend'}</a>}
                  </li>
                </ul>
              </div>
            )
        )}
      </div>

      <div className="h-full w-full flex flex-col px-2">
        {channel.channel?.messages?.map((message) => (
          <div key={message._id} className={`chat ${message.author._id === session.data?.user.id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image src={message.author.image || '/default.png'} alt={`Avatar of ${message.author.username}`} height={100} width={100} priority />
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
        <div className="w-full flex justify-between gap-2 p-2">
          <form className="dropdown dropdown-top">
            <label tabIndex={0} className="btn btn-outline btn-accent">
              {fileDataURL ? <Image src={fileDataURL} alt={'Chat image'} width={25} height={25} /> : '+'}
            </label>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
              <li className="flex gap-2 justify-between">
                <input type="file" onChange={(e) => handleFileInput(e)} className="file-input file-input-bordered file-input-accent h-full" accept="image/png, image/jpeg, image/jpg" />
                {fileDataURL && (
                  <button className="btn btn-square btn-outline" onClick={() => setFileDataURL('')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </li>
            </ul>
          </form>

          <form onSubmit={(e) => sendMessage(e)} className="flex flex-1 gap-2 justify-between items-stretch">
            <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
            <button onClick={sendMessage} className={`btn btn-primary ${(sendLoading || !textInput || !textInput.trim()) && !fileDataURL && 'btn-disabled'}`}>
              {sendLoading ? <span className="loading loading-dots loading-md"></span> : 'Send'}
            </button>
          </form>
        </div>
      )}

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
