'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import useChannel from '@/context/ChannelProvider';
import useFriends from '@/context/FriendsProvider';

interface SignInData {
  email: string;
  password: string;
}

const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function SignIn() {
  const [data, setData] = useState<SignInData>({
    email: '',
    password: ''
  });
  const [indicator, setIndicator] = useState<SignInData>({
    email: '',
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

  const sampleSignIn = async () => {
    try {
      setLoading(true);

      const res = await signIn('credentials', {
        email: process.env.NEXT_PUBLIC_TEST_USER_EMAIL,
        password: process.env.NEXT_PUBLIC_TEST_USER_PASSWORD,
        redirect: false
      });

      if (res?.error) throw new Error('Failed to sign in sample user.');

      channel.refetch();
      friends.refetch();
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error(err);
      setError('Could not sign in sample user.');
    } finally {
      setLoading(false);
    }
  };

  const signInCredentials = async (e: FormEvent) => {
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
    } else if (!data.password) {
      return setIndicator((prev) => {
        setLoading(false);
        return { ...prev, password: 'Required!' };
      });
    }

    try {
      const res = await signIn('credentials', {
        ...data,
        redirect: false
      });

      if (res?.error) throw new Error('Invalid credentials.');

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
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight ">Sign in to your account</h2>
      </div>

      <form onSubmit={signInCredentials} className="space-y-6 flex flex-col items-center" action="#" method="POST">
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
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div className="divider">OR</div>
      </form>

      <Link className="self-center" href={'/register'}>
        <button className={'btn btn-outline btn-secondary'}>Register</button>
      </Link>

      <button onClick={sampleSignIn} className={'btn btn-link'}>
        Sample Account
      </button>

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
