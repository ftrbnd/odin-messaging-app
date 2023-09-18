'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { useEffect, useState, MouseEvent } from 'react';

export default function AccountCard() {
  const [editing, setEditing] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');

  const { data: session, update } = useSession();

  useEffect(() => {
    if (session?.user.name) setNewUsername(session?.user.name);
    if (session?.user.email) setNewEmail(session?.user.email);
  }, [session?.user.email, session?.user.name]);

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();

    try {
      if (editing && (newUsername !== session?.user.name || newEmail !== session?.user.email)) {
        const res = await fetch(`http://localhost:3000/api/users/${session?.user.id}/edit`, {
          method: 'POST',
          body: JSON.stringify({
            newUsername: newUsername !== session?.user.name ? newUsername : '',
            newEmail: newEmail !== session?.user.email ? newEmail : ''
          })
        });

        if (!res.ok) throw new Error('Failed to edit user.');

        await update({
          ...session,
          user: {
            ...session?.user,
            name: newUsername,
            email: newEmail
          }
        });
      }
      setEditing((prev) => !prev);
    } catch (err) {
      console.error(err);
      setError('Could not edit user.');
      if (session?.user.name) setNewUsername(session?.user.name);
      if (session?.user.email) setNewEmail(session?.user.email);
    }
  };

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="flex flex-col items-center">
        <figure className="px-10 pt-10">
          <Image src={session?.user.image || '/default.png'} alt="User image" width={96} height={96} />
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
