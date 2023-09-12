'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('All fields are required!');
      return;
    }

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false
      });

      if (res?.error) {
        setError('Invalid credentials!');
        return;
      }

      router.refresh();
      router.replace('/');
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Sign In</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="p-2" onChange={(e) => setEmail(e.target.value)} type="text" placeholder="Email" />
          <input className="p-2" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button type="submit" className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2 rounded-md">
            Sign In
          </button>
          {error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}

          <Link className="text-sm mt-3 text-right" href={'/register'}>
            {"Don't have an account?"} <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
