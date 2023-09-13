'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

interface SignUpData {
  email: string;
  password: string;
}

const isValidEmail = (email: string) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

export default function SignIn() {
  const [data, setData] = useState<SignUpData>({
    email: '',
    password: ''
  });
  const [indicator, setIndicator] = useState<SignUpData>({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const session = useSession();
  console.log('SignIn page session: ', session);

  useEffect(() => {
    if (session.data?.user) router.push('/');
  });

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

    const res = await signIn('credentials', {
      ...data,
      redirect: false
    });

    if (!res?.ok) {
      setLoading(false);
      return setError('An error occurred while signing in.');
    }

    router.push('/account');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-base-200">
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
      </form>

      {error && (
        <div className="toast">
          <div className="alert alert-info">
            <span>{error}</span>
          </div>
        </div>
      )}
    </div>
  );
}
