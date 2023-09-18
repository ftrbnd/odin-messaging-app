import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import AccountCard from '@/components/AccountCard';

export default async function Account() {
  const session = await getServerSession();
  if (!session?.user) redirect('/');

  return (
    <div className="flex h-full flex-col items-center gap-2 px-6 py-12 lg:px-8 bg-base-200">
      <h1 className="text-2xl text-center">Your Account</h1>
      <AccountCard />
    </div>
  );
}
