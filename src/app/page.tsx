import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession();
  console.log('Home page session:', session);

  return (
    <>
      {session ? (
        <></>
      ) : (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello there</h1>
              <p className="py-6">
                {
                  "This messaging app is a project that was created following The Odin Project's NodeJS course. I built this with: TypeScript, Next.js, TailwindCSS, DaisyUI, MongoDB, Prisma, and NextAuth."
                }
              </p>
              <button className="btn btn-primary">
                <Link href={'/signin'}>Get Started</Link>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
