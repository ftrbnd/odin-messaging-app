'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import useChannel from '@/context/ChannelProvider';
import useFriends from '@/context/FriendsProvider';

interface RegisterData {
  email: string;
  username: string;
  password: string;
}

const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function Register() {
  const [data, setData] = useState<RegisterData>({
    email: '',
    username: '',
    password: ''
  });
  const [indicator, setIndicator] = useState<RegisterData>({
    email: '',
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const session = useSession();
  const channel = useChannel();
  const friends = useFriends();

  useEffect(() => {
    if (session.data?.user) router.push('/');
  });

  const register = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!data.email) {
      return setIndicator((prev) => {
        setLoading(false);
        return { ...prev, email: 'Required!' };
      });
    } else if (!isValidEmail(data.email)) {
      return setIndicator((prev) => {
        setLoading(false);
        return { ...prev, email: 'Invalid!' };
      });
    } else if (!data.username) {
      return setIndicator((prev) => {
        setLoading(false);
        return { ...prev, username: 'Required!' };
      });
    } else if (!data.password) {
      return setIndicator((prev) => {
        setLoading(false);
        return { ...prev, password: 'Required!' };
      });
    }

    try {
      const registerRes = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });

      if (!registerRes.ok) throw new Error('Failed to register user.');

      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      });

      if (!signInRes?.ok) throw new Error('Failed to sign in user after registering.');

      channel.refetch();
      friends.refetch();
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col justify-center items-center px-6 py-12 lg:px-8 bg-base-200 gap-4">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">Create your account</h2>
      </div>

      <form onSubmit={register} className="space-y-6 flex flex-col items-center" action="#" method="POST">
        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Email address</span>
          </label>
          <div className="indicator">
            {indicator.email && <span className="indicator-item badge">{indicator.email}</span>}
            <input
              type="email"
              placeholder="example@email.com"
              autoComplete="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Username</span>
          </label>
          <div className="indicator">
            {indicator.username && <span className="indicator-item badge">{indicator.username}</span>}
            <input
              type="text"
              placeholder="your-cool-username"
              autoComplete="username"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>

        <div className="form-control w-full max-w-xs">
          <label className="label">
            <span className="label-text">Password</span>
          </label>
          <div className="indicator">
            {indicator.password && <span className="indicator-item badge">{indicator.password}</span>}
            <input
              type="password"
              placeholder="Password..."
              autoComplete="current-password"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </div>

        <button type="submit" className={`btn btn-primary ${loading && 'btn-disabled'}`}>
          {loading && <span className="loading loading-spinner"></span>}
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="divider">OR</div>
      </form>

      <Link className="self-center" href={'/signin'}>
        <button className={'btn btn-outline btn-secondary'}>Sign In</button>
      </Link>

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
