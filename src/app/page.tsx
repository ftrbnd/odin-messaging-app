import Dashboard from '@/components/Dashboard';
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession();

  return (
    <>
      {session ? (
        <Dashboard />
      ) : (
        <div className="hero h-full bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello there!</h1>
              <p className="py-6">
                This messaging app is a project that I created as I followed{' '}
                <a className="link link-primary" href="https://www.theodinproject.com/lessons/nodejs-messaging-app" target="_blank">
                  {"The Odin Project's"}
                </a>{' '}
                NodeJS course. I built this with Next.js/TypeScript, Tailwind CSS/DaisyUI, MongoDB/Mongoose, and NextAuth.
              </p>
              <Link href={'/signin'}>
                <button className="btn btn-primary">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
