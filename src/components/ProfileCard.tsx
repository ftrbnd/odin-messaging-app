'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function ProfileCard() {
  const session = useSession();

  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <figure className="px-10 pt-10">
        <Image src={session.data?.user.image || '/default.png'} alt="User image" width={96} height={96} />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{session.data?.user.name ?? 'Username'}</h2>
        <p>{session.data?.user?.email ?? 'Email'}</p>
        <div className="card-actions">
          <button className="btn btn-primary">Edit</button>
        </div>
      </div>
    </div>
  );
}
