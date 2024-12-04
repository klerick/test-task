import NextAuth, { CredentialsSignin, NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextResponse } from 'next/server';

class InvalidLoginError extends CredentialsSignin {
  code = 'Invalid identifier or password';
}

const credentialsProvider = CredentialsProvider({
  type: 'credentials',
  credentials: {
    username: {
      label: 'Username',
      type: 'text',
      value: 'user',
      placeholder: 'User name',
    },
    password: {
      label: 'Password',
      type: 'password',
      value: 'password',
      placeholder: 'Password',
    },
  },
  async authorize(credentials, req) {
    if ('email' in credentials && credentials.email === 'user@example.com') {
      return {
        id: '1',
        email: credentials.email,
        name: 'John Doe',
      };
    }
    return null;
  },
});

export const authOptions: NextAuthConfig = {
  providers: [credentialsProvider],
  trustHost: true,
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
  secret: 'secret',
};

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);
