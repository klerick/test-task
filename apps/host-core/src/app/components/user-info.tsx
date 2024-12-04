'use client';

import { signOut } from '@technical-test/auth';
import { Session } from 'next-auth';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

interface MainPageProps {
  session?: Session;
}

export const UserInfo = ({ session }: MainPageProps) => {
  const email = session?.user?.email || '';
  const name = email.split('@')[0];
  const router = useRouter();

  const logout = () => signOut().then(() => router.refresh());

  return (
    <div className="flex justify-between">
      <div className="flex items-center">
        <Link href="/">
          <img
            alt="Test"
            src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
            className="mx-auto h-10"
          />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        <span className="relative flex shrink-0 overflow-hidden rounded-full w-16 h-16">
          <span className="flex h-full w-full items-center justify-center rounded-full bg-muted">
            {name}
          </span>
        </span>
        <div className="flex flex-col">
          <small>{email}</small>
        </div>
        <Link className="flex flex-col" onClick={() => logout()} href={`/`}>
          Logout
        </Link>
      </div>
    </div>
  );
};
