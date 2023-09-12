'use client';

import { signOut } from 'next-auth/react';

export default function SignOut() {
  const handleClick = () => {
    signOut();
  };

  return (
    <button onClick={handleClick} className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md">
      Sign Out
    </button>
  );
}
