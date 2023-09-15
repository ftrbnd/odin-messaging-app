import { getServerSession } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import SignOutButton from './SignOutButton';
import HamburgerButton from './HamburgerButton';

export default async function Navbar() {
  const session = await getServerSession();

  const imageLoader = () => {
    return session?.user && session.user.image ? session.user.image : '/default.png';
  };

  return (
    <div className="navbar bg-base-100">
      <HamburgerButton />
      <div className="flex-1">
        <Link className="btn btn-ghost normal-case text-xl" href={'/'}>
          Home
        </Link>
      </div>
      <div className="flex-none">
        {session && (
          <Link href={'/account'}>
            <p className="btn btn-ghost normal-case text-xl">{session?.user?.name}</p>
          </Link>
        )}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="w-10 rounded-full">
              <Image src={imageLoader()} alt={`Photo of ${session?.user?.name || 'anonymous user'}`} width={100} height={100} />
            </div>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            {session ? (
              <>
                <li>
                  <Link href={'/account'}>Account</Link>
                </li>
                <li>
                  <SignOutButton />
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href={'/signin'}>Sign In</Link>
                </li>
                <li>
                  <Link href={'/register'}>Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
