'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();

  const handleClick = async () => {
    await signOut();
    router.push('/');
    router.refresh();
  };

  return <button onClick={handleClick}>Sign Out</button>;
}
