import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function Account() {
  const session = await getServerSession();
  if (!session?.user) redirect('/');
  console.log('Account page session: ', session);

  return (
    <>
      <h1 className="text-2xl text-center">Your Account</h1>
      <p>{`Hello ${session.user?.name}!`}</p>
      <p>Email: {session.user?.email}</p>
      {session.user?.image && <Image src={session.user.image} width={200} height={200} alt={`Picture of ${session.user?.name}`} />}
    </>
  );
}
