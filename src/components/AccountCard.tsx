'use client';

import { OurFileRouter } from '@/app/api/uploadthing/core';
import { FileWithPath } from '@uploadthing/react';
import { generateReactHelpers, useDropzone } from '@uploadthing/react/hooks';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState, MouseEvent, useCallback } from 'react';
import { generateClientDropzoneAccept } from 'uploadthing/client';

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export default function AccountCard() {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const [editLoading, setEditLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();
  const { data: session, update } = useSession();

  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo } = useUploadThing('profilePicture', {
    onClientUploadComplete: (res) => {
      if (res && res[0].url) {
        editAccount(res[0].url);
      }
    },
    onUploadError: (e) => {
      setError(e.message);
      setEditLoading(false);
      setFiles([]);
    },
    onUploadBegin: () => {
      setEditLoading(true);
    }
  });

  useEffect(() => {
    if (session?.user.name) setNewUsername(session?.user.name);
    if (session?.user.email) setNewEmail(session?.user.email);
  }, [session?.user.email, session?.user.name, session?.user.image]);

  const validateEdit = async (e: MouseEvent) => {
    e.preventDefault();

    if (session?.user.id === process.env.NEXT_PUBLIC_TEST_USER_ID) {
      throw new Error('Cannot edit sample user!');
    }

    if (files.length > 0) {
      await startUpload(files);
    } else {
      await editAccount();
    }
  };

  const editAccount = async (imageUrl?: string) => {
    try {
      if (editing && (newUsername !== session?.user.name || newEmail !== session?.user.email || imageUrl)) {
        setEditLoading(true);

        const res = await fetch(`/api/users/${session?.user.id}/edit`, {
          method: 'POST',
          body: JSON.stringify({
            // only send new values
            newUsername: newUsername !== session?.user.name ? newUsername : '',
            newEmail: newEmail !== session?.user.email ? newEmail : '',
            newImage: imageUrl ?? session?.user.image
          })
        });

        if (!res.ok) throw new Error('Failed to edit user.');

        await update({
          ...session,
          user: {
            ...session?.user,
            name: newUsername,
            email: newEmail,
            image: imageUrl ?? session?.user.image
          }
        });
      }

      setEditing((prev) => !prev);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setEditLoading(false);

      // reset to default
      if (session?.user.name) setNewUsername(session?.user.name);
      if (session?.user.email) setNewEmail(session?.user.email);
      setFiles([]);

      router.refresh();
    }
  };

  const fileTypes = permittedFileInfo?.config ? Object.keys(permittedFileInfo?.config) : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined
  });

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="flex flex-col items-center">
        <figure className="px-10 pt-10 flex gap-2">
          <Image src={session?.user.image || '/default.png'} alt="User image" width={96} height={96} priority className="rounded-xl mask" />
          {editing && files.length === 0 && (
            <div {...getRootProps()} className="btn btn-outline btn-accent">
              <input {...getInputProps()} />
              New Avatar
            </div>
          )}
          {editing && files.length > 0 && (
            <div className="tooltip tooltip-open" data-tip="New Avatar">
              <button className="btn no-animation">{`${files[0].name}`}</button>
            </div>
          )}
        </figure>
      </div>
      <div className="card-body items-center text-center">
        {editing ? (
          <>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">New Username</span>
              </label>
              <input type="text" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} className="input input-bordered input-secondary w-full max-w-xs" />
            </div>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text">New Email</span>
              </label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} className="input input-bordered input-secondary w-full max-w-xs" />
            </div>
          </>
        ) : (
          <>
            <h2 className="card-title">{session?.user.name ?? 'Username'}</h2>
            <p>{session?.user?.email ?? 'Email'}</p>
          </>
        )}

        <div className="card-actions">
          {editing ? (
            <>
              <button
                onClick={() => {
                  setEditing(false);
                  if (session?.user.name) setNewUsername(session?.user.name);
                  if (session?.user.email) setNewEmail(session?.user.email);
                  setFiles([]);
                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button onClick={(e) => validateEdit(e)} className={`btn btn-primary ${editLoading && 'btn-disabled'}`}>
                {editLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Saving...
                  </>
                ) : (
                  'Save'
                )}
              </button>
            </>
          ) : (
            <button onClick={() => setEditing(true)} className={`btn btn-primary`}>
              Edit
            </button>
          )}
        </div>
      </div>

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
