'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

import BreadCrumb from '@/utils/makeBreadCrum';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const pathnames = [
  {
    label: 'Главная',
    url: '/',
  },
  {
    label: 'Профиль',
    url: '/profile',
  },
];

export const ProfileMain = () => {
  const { data: session }: any = useSession();

  return (
    <Card className="m-2 sm:m-5 h-full shadow-black/20 shadow-lg ">
      <CardHeader className="p-5 pb-0">
        <div>
          <BreadCrumb items={pathnames} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row mt-2">
        {/* Левая колонка: информация о пользователе */}

        <div className="flex-1 max-w-[400px]">
          <Card className="pt-5">
            <div className="">
              <CardContent className="flex items-center  gap-4">
                <Avatar className="w-24 h-24 rounded-xl">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-xl">{session?.user?.name}</p>
                  <p className="text-sm">Email: {session?.user?.email}</p>
                  <p className="text-sm">ID: {session?.user?.id}</p>
                </div>
              </CardContent>
            </div>
            <CardContent>
              <CardDescription className="mb-2">Информация о пользователе</CardDescription>
              <CardDescription className="mb-2">Обо мне</CardDescription>
              <CardDescription className="mb-2">Мои привычки</CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка: лента последних привычек */}

        <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
          <Card className="p-4">
            <CardTitle className="text-xl font-semibold">Последние привычки</CardTitle>
            <ul className="list-disc ml-4 mt-2">
              {/* Пример данных привычек, их можно заменить на реальные данные */}
              <li>Утренняя зарядка - Выполнено 5 раз</li>
              <li>Чтение книги - Выполнено 3 раза</li>
              <li>Медитация - Выполнено 7 раз</li>
              {/* Добавьте отображение реальных привычек пользователя здесь */}
            </ul>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};
