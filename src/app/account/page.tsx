import { getServerSession } from 'next-auth';
import { options } from '../api/auth/[...nextauth]/options';
import SignIn from '@/components/SignIn';
import SignOut from '@/components/SignOut';

export default async function Account() {
  const session = await getServerSession(options);
  console.log('Account Page', session);

  return (
    <>
      <h1>Your Account</h1>
      {session ? (
        <>
          <p>{`Hello ${session.user?.name}!`}</p>
          <SignOut />
        </>
      ) : (
        <p>{'You are not signed in.'}</p>
      )}
      {!session && <SignIn />}
    </>
  );
}
