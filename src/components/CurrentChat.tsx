'use client';

import useChannel from '@/context/ChannelProvider';
import useFriends from '@/context/FriendsProvider';
import { ChannelDocument } from '@/models/Channel';
import { UserDocument } from '@/models/User';
import { FileWithPath } from '@uploadthing/react';
import { useDropzone } from '@uploadthing/react/hooks';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { FormEvent, useCallback, useState } from 'react';
import { UploadFileResponse, generateClientDropzoneAccept } from 'uploadthing/client';

import { generateReactHelpers } from '@uploadthing/react/hooks';
import { OurFileRouter } from '@/app/api/uploadthing/core';

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function CurrentChat() {
  const [textInput, setTextInput] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const [sendLoading, setSendLoading] = useState(false);
  const [friendLoading, setFriendLoading] = useState(false);
  const [error, setError] = useState('');

  const channel = useChannel();
  const friends = useFriends();
  const session = useSession();

  const { startUpload, permittedFileInfo } = useUploadThing('messageAttachment', {
    onClientUploadComplete: (res) => {
      sendMessage(res);
    },
    onUploadError: (e) => {
      setError(e.message);
      setSendLoading(false);
      setFiles([]);
    },
    onUploadBegin: () => {
      setSendLoading(true);
    }
  });

  const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined
  });

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

  const validateMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (files.length > 0) {
      await startUpload(files);
    } else {
      await sendMessage();
    }
  };

  const sendMessage = async (files?: UploadFileResponse[]) => {
    if ((!textInput || !textInput.trim()) && !files) return setTextInput('');

    try {
      setSendLoading(true);

      const imageLinks: string[] = [];
      if (files) {
        files.forEach((file) => imageLinks.push(file.url));
      }

      const res = await fetch('/api/messages/new', {
        method: 'POST',
        body: JSON.stringify({
          text: textInput,
          media: imageLinks,
          channelId: channel.channel?._id
        })
      });

      if (!res.ok) throw new Error('Failed to send message.');

      const { channel: channelCreated }: { channel: ChannelDocument } = await res.json();

      channel.setChannel(channelCreated);
      setTextInput('');
      if (files) setFiles([]);
    } catch (err) {
      console.error(err);
      setError('Could not send message.');
    } finally {
      setSendLoading(false);
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
            <div className="chat-bubble">
              {message.text}
              {message.media?.map((media) => (
                <Image key={media} src={media} alt="Message attachment" width={100} height={100} className="rounded-xl mask h-full w-full" />
              ))}
            </div>
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

      {files && files.map((file) => <p key={file.name}>{file.name}</p>)}

      {channel.channel && (
        <div className="w-full flex justify-between gap-2 p-2">
          {files.length > 0 && (
            <button onClick={() => setFiles([])} className="btn btn-outline btn-error">
              x
            </button>
          )}
          <div {...getRootProps()} className="btn btn-outline btn-accent">
            <input {...getInputProps()} />+
          </div>

          <form onSubmit={(e) => validateMessage(e)} className="flex flex-1 gap-2 justify-between items-stretch">
            <input type="text" placeholder="Type here" className="input input-bordered input-primary w-full max-w" value={textInput} onChange={(e) => setTextInput(e.target.value)} />
            <button onClick={validateMessage} className={`btn btn-primary ${(sendLoading || !textInput || !textInput.trim()) && (files.length === 0 || sendLoading) && 'btn-disabled'}`}>
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
