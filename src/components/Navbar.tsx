import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <nav className="p-4 bg-black text-white flex justify-start gap-4 items-center">
      <Link href={'/'}>Home</Link>
      <Link href={'/profile'}>Profile</Link>
    </nav>
  );
};

export default Navbar;
