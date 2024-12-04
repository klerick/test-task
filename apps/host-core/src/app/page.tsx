import LoginForm from './components/login-form';
import MainPage from './components/main';
import { auth } from '@technical-test/auth';

export default async function Index({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const session = await auth();
  return session ? <MainPage searchParams={searchParams} /> : <LoginForm />;
}
