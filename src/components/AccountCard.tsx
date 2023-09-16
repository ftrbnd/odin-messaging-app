'use client';

import { UserDocument } from '@/models/User';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function AccountCard() {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const session = useSession();

  useEffect(() => {
    if (session.data?.user.name) setNewUsername(session.data?.user.name);
    if (session.data?.user.email) setNewEmail(session.data?.user.email);
  }, [session.data?.user.email, session.data?.user.name]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (editing && (newUsername !== session.data?.user.name || newEmail !== session.data?.user.email)) {
      const res = await fetch(`http://localhost:3000/api/users/${session.data?.user.id}/edit`, {
        method: 'POST',
        body: JSON.stringify({ newUsername, newEmail })
      });

      const { user }: { user: UserDocument } = await res.json();
      console.log('UPDATED USER: ', user);
    }
    setEditing((prev) => !prev);
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="flex flex-col items-center">
        <figure className="px-10 pt-10">
          <Image src={session.data?.user.image || '/default.png'} alt="User image" width={96} height={96} />
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
            <h2 className="card-title">{session.data?.user.name ?? 'Username'}</h2>
            <p>{session.data?.user?.email ?? 'Email'}</p>
          </>
        )}

        <div className="card-actions">
          {editing && (
            <button onClick={() => setEditing(false)} className="btn btn-secondary">
              Cancel
            </button>
          )}
          <button onClick={(e) => handleClick(e)} className="btn btn-primary">
            {editing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>
    </div>
  );
}
