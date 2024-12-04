import { auth } from '@technical-test/auth';
import { UserInfo } from './components/user-info';

export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <>
      {session && <UserInfo session={session} />}
      {children}
    </>
  );
}
