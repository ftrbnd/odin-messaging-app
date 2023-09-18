'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

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
  console.log('Register page session: ', session);

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
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data })
      });

      if (!res.ok) throw new Error('Failed to register user.');
    } catch (err) {
      console.error(err);
      setError('Could not register user.');
    } finally {
      setLoading(false);
    }

    router.push('/signin');
  };

  return (
    <div className="flex h-full flex-col justify-center px-6 py-12 lg:px-8 bg-base-200">
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
