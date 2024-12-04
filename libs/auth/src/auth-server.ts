'use server';

import { signIn as signInAuth, signOut as signOutAuth } from './auth';
import { CredentialsSignin } from 'next-auth';

export const signIn = async (...args: Parameters<typeof signInAuth>) => {
  try {
    return await signInAuth.call(signInAuth, ...args);
  } catch (e) {
    if (e instanceof CredentialsSignin) {
      return {
        error: 'Incorrect username or password',
      };
    }
  }
};
export const signOut = signOutAuth.bind(signOutAuth);
