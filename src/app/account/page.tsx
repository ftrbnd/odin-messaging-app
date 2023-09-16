import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import ProfileCard from '@/components/ProfileCard';

export default async function Account() {
  const session = await getServerSession();
  if (!session?.user) redirect('/');
  console.log('Account page session: ', session);

  return (
    <div className="flex h-full flex-col items-center gap-2 px-6 py-12 lg:px-8 bg-base-200">
      <h1 className="text-2xl text-center">Your Account</h1>
      <ProfileCard />
    </div>
  );
}
