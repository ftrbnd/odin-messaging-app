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
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">
                {
                  "This messaging app is a project that was created following The Odin Project's NodeJS course. I built this with: TypeScript, Next.js, TailwindCSS, DaisyUI, MongoDB/Mongoose, and NextAuth."
                }
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
