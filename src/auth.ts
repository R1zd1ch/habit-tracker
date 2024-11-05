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
        // Проверяем, существует ли пользователь
        let existingUser = (await db.user.findUnique({
          where: { email: user.email as any },
        })) as any;

        // Если пользователь не существует, создаем его
        if (!existingUser) {
          existingUser = await db.user.create({
            data: {
              email: user.email as any,
              name: profile?.name || user.name || '',
              image: (profile as any)?.avatar_url || user.image || '',
            },
          });
        }

        // Сохраняем учетную запись провайдера, если она еще не привязана
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
        token.email = user.email;
        const userIdDB = await db.user.findUnique({
          where: { email: user.email as any },
        });
        token.id = userIdDB?.id;
        token.image = user.image;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token) {
        session.user = {
          image: token.image,
          name: token.name,
          email: token.email,
          id: token.id,
        };
        return session;
      }
    },
    async redirect({ baseUrl }) {
      // Получаем токен пользователя для идентификации
      const session = await getSession(); // Используем `getSession` для получения токена сессии

      // Проверяем, если сессия не найдена, возвращаем базовый URL
      if (!session || !session.user) {
        return baseUrl;
      }

      const email = session.user.email;

      // Проверяем в базе данных, существует ли пользователь и установлен ли пароль
      const user = await db.user.findUnique({
        where: { email: email as any },
      });

      // Если пользователь не найден, возвращаем базовый URL
      if (!user) {
        return baseUrl;
      }

      // Определяем, нужно ли перенаправить пользователя на установку пароля
      const isNewUser = !user.password; // Если пароля нет, пользователь считается новым

      if (isNewUser) {
        // Перенаправляем на страницу установки пароля
        return `${baseUrl}/set-password`;
      }

      // Перенаправляем на домашнюю страницу, если пароль уже установлен
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
