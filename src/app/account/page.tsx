import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import SignIn from '@/components/SignIn';
import SignOut from '@/components/SignOut';
import Image from 'next/image';

export default async function Account() {
  const session = await getServerSession(options);

  return (
    <>
      <h1 className="text-2xl text-center">Your Account</h1>
      {session ? (
        <>
          <p>{`Hello ${session.user?.name}!`}</p>
          <Image src={session.user.image} width={200} height={200} alt={`Picture of ${session.user.name}`} />
          <p>Email: {session.user.email}</p>
          <SignOut />
        </>
      ) : (
        <p>{'You are not signed in.'}</p>
      )}
      {!session && <SignIn />}
    </>
  );
}
