'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !username || !password) {
      setError('All fields are required!');
      return;
    }

    try {
      const userExistsRes = await fetch('api/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const { user } = await userExistsRes.json();

      if (user) {
        setError('User already exists!');
        return;
      }

      const registerRes = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          username,
          password
        })
      });

      if (registerRes.ok) {
        setEmail('');
        setUsername('');
        setPassword('');

        router.push('/account');
      } else {
        console.log('User registration failed!');
      }
    } catch (err) {
      console.log('Error during registration: ', err);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input className="p-2" onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
          <input className="p-2" onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" />
          <input className="p-2" onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
          <button type="submit" className="bg-green-600 text-white font-bold cursor-pointer px-6 py-2">
            Register
          </button>

          {error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}

          <Link className="text-sm mt-3 text-right" href={'/'}>
            Already have an account? <span className="underline">Sign In</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
