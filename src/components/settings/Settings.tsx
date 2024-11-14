/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent, CardHeader } from '../ui/card';
import BreadCrumb from '@/utils/makeBreadCrum';
import ChangeName from './ChangeName';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import ChangeEmail from './ChangeEmail';
import ChangePassword from './ChangePassword';
import bcrypt from 'bcryptjs';
import ConfirmChanges from './ConfirmChanges';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { toast } from 'sonner';

const pathnames = [
  {
    label: 'Главная',
    url: '/',
  },
  {
    label: 'Настройки',
    url: '/settings',
  },
];

export const Settings = () => {
  const { data: session } = useSession();
  const [name, setName] = useState(session?.user?.name);
  const [email, setEmail] = useState(session?.user?.email);
  const [password, setPassword] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const sessionPassword = (session?.user as any)?.password as any;
  const { id }: any = session?.user ?? 0;

  useEffect(() => {
    if (session?.user?.name && session?.user?.email) {
      session.user = { ...session.user, name, email };
    }
  }, [name, email]);

  const handleChange = async () => {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const response = await fetch('/api/editProfile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password: hashedPassword,
          userId: id,
        }),
      });

      if (response.ok) {
        toast.success('Изменения успешно применены');
        setIsOpen(false);
      } else {
        toast.error('Не удалось применить изменения');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Ошибка при обновлении профиля');
    }
  };

  const handleConfirm = async (oldEmail: string, oldPassword: string) => {
    if (oldEmail !== session?.user?.email) {
      toast.error('Неверная старая почта');
      setIsOpen(false);
      return;
    }
    const hashedOldPassword = await bcrypt.hash(oldPassword, 10);
    const isPasswordValid = await bcrypt.compare(hashedOldPassword, sessionPassword);
    if (isPasswordValid) {
      toast.error('Неверный старый пароль');
      setIsOpen(false);
      return;
    }

    await handleChange();
  };

  return (
    <Card className="m-2 sm:m-5 h-full shadow-black/20 shadow-lg">
      <CardHeader className="p-5 pb-0">
        <div>
          <BreadCrumb items={pathnames} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col sm:flex-row mt-4 gap-4 sm:gap-6">
        <Card className="flex-grow">
          <CardHeader>Настройка профиля</CardHeader>
          <CardContent className="flex flex-col items-center gap-4 justify-center pl-0">
            <div className="w-full">
              <ChangeName props={{ name, setName, email, password, id }} />
              <ChangeEmail props={{ name, email, setEmail, password, id }} />
              <ChangePassword props={{ name, email, password, setPassword, id }} />
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger className="w-1/2 flex items-center justify-center">
                <div
                  className="bg-primary flex items-center justify-center h-10 rounded-lg cursor-pointer p-5 px-8 hover:bg-primary/80 transition-colors duration-300 ease-in-out"
                  onClick={() => setIsOpen(true)}
                >
                  <p className="text-secondary">Применить</p>
                </div>
              </DialogTrigger>
              <ConfirmChanges handleSubmit={handleConfirm} />
            </Dialog>
          </CardContent>
        </Card>
        <Card className="flex-grow">
          <CardHeader>Прочие настройки</CardHeader>
        </Card>
      </CardContent>
    </Card>
  );
};
