/* eslint-disable @typescript-eslint/no-explicit-any */

import NextAuth from 'next-auth';
import db from '@/db/db';
import providers from '@/auth.config';
import { getSession } from 'next-auth/react';

export const handler = NextAuth({
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/sign-in',
  },
  ...providers,

  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider !== 'credentials') {
        // Check if the user exists in the database
        let existingUser = await db.user.findUnique({
          where: { email: user.email as any },
        });

        // If the user does not exist, create it
        if (!existingUser) {
          existingUser = await db.user.create({
            data: {
              email: user.email as any,
              name: profile?.name || user.name || '',
              image: (profile as any)?.avatar_url || user.image || '',
            },
          });
        }

        // Save the provider account if it does not exist
        const accountExists = await db.account.findFirst({
          where: {
            userId: existingUser.id,
            provider: account?.provider,
            providerAccountId: account?.providerAccountId,
          },
        });

        if (!accountExists) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              provider: account?.provider as string,
              providerAccountId: account?.providerAccountId as string,
              type: 'oauth',
            },
          });
        }

        return true;
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        // Fetch user data from the database and update token fields
        const userInDb = await db.user.findUnique({
          where: { email: user.email as any },
        });
        if (userInDb) {
          token.id = userInDb.id;
          token.email = userInDb.email;
          token.name = userInDb.name;
          token.image = userInDb.image;
          token.password = userInDb.password;
          token.role = userInDb.role;
        }
        if (!userInDb) {
          token.id = user.id;
          token.email = user.email;
          token.name = user.name;
          token.image = user.image;
        }
      }
      return token;
    },

    async session({ session, token }: any) {
      // Use token data to set session fields with values from the database
      if (token && token.id) {
        const userInDb = await db.user.findUnique({
          where: { id: token.id },
        });

        session.user = {
          id: token.id,
          email: userInDb?.email || token.email,
          name: userInDb?.name || token.name,
          image: userInDb?.image || token.image,
          password: userInDb?.password || '',
          role: userInDb?.role || 'user',
        };
      }
      return session;
    },
    async redirect({ baseUrl }) {
      const session = await getSession();

      if (!session || !session.user) {
        return baseUrl;
      }

      const email = session.user.email;
      const user = await db.user.findUnique({
        where: { email: email as any },
      });

      if (!user) {
        return baseUrl;
      }

      const isNewUser = !user.password;

      return isNewUser ? `${baseUrl}/set-password` : baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
