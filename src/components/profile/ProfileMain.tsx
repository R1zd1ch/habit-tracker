'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import BreadCrumb from '@/utils/makeBreadCrum';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useEffect, useState } from 'react';
import ProfileNotes from './ProfileNotes';
import ProfileLastHabits from './ProfileLastHabbits';
import { Dialog, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import ProfileAddNote from './ProfileAddNote';

const pathnames = [
  { label: 'Главная', url: '/' },
  { label: 'Профиль', url: '/profile' },
];

export const ProfileMain = () => {
  const { data: session, status }: any = useSession();
  const [habits, setHabits] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const userId: number = session?.user?.id;

  useEffect(() => {
    if (status === 'authenticated' && userId) {
      // Проверка на аутентификацию и наличие userId
      const getHabits = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/habits?userId=${userId}`, { method: 'GET' });
          const data = await response.json();
          if (response.ok) {
            setHabits(data);
            console.log(data);
          } else {
            console.error('Error fetching habits:', data);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      getHabits();
    }
  }, [status, userId]);

  const onEdit = (updatedNote: any) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) => (note.id === updatedNote.id ? updatedNote : note)),
    );
  };

  useEffect(() => {
    if (status === 'authenticated' && userId) {
      // Проверка на аутентификацию и наличие userId
      const getNotes = async () => {
        setIsLoadingNotes(true);
        try {
          const response = await fetch(`/api/notes?userId=${userId}`, { method: 'GET' });
          const data = await response.json();
          if (response.ok) {
            setNotes(data);
            console.log(data);
          } else {
            console.error('Error fetching notes:', data);
          }
        } catch (error) {
          console.error('Fetch error:', error);
        } finally {
          setIsLoadingNotes(false);
        }
      };
      getNotes();
    }
  }, [status, userId]);

  const onAdd = (note: any) => {
    setNotes((prevNotes) => [...prevNotes, note]);
  };

  const onDelete = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  return (
    <Card className="flex flex-col m-2 sm:m-5 min-h-[500px] shadow-black/20 shadow-lg">
      <CardHeader className="p-5 pb-0">
        <div>
          <BreadCrumb items={pathnames} />
        </div>
      </CardHeader>

      <CardContent className="flex flex-col md:flex-row mt-2">
        {/* Левая колонка: информация о пользователе */}
        <div className="flex-1 max-w-[400px]">
          <Card className="pt-5 min-h-full">
            <div>
              <CardContent className="flex items-center gap-4">
                <Avatar className="w-24 h-24 rounded-xl">
                  <AvatarImage src={session?.user?.image} />
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
              <CardDescription className="mb-1 text-xl text-black dark:text-neutral-200">
                Информация о пользователе:
              </CardDescription>
              <CardDescription className="mb-2 text-black dark:text-neutral-200">
                Обо мне
              </CardDescription>
              <CardDescription className="mb-2 text-black dark:text-neutral-200">
                Мои привычки
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Правая колонка: лента последних привычек */}
        <div className="flex-1 mt-4 sm:mt-0 sm:ml-4">
          <Card className="p-4 min-h-full">
            <CardTitle className="text-xl font-semibold mb-2">Последние привычки</CardTitle>
            <ProfileLastHabits habits={habits} isLoading={isLoading} />
          </Card>
        </div>
      </CardContent>
      <Card className="m-2 sm:m-5 min-h-[200px]  shadow-black/20 shadow-lg">
        <div className="flex flex-col sm:flex-row items-center justify-center">
          <CardHeader className="text-xl font-bold">Заметки</CardHeader>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger className="m-4" asChild>
              <Button className="ml-auto" disabled={isLoadingNotes} onClick={() => setIsOpen(true)}>
                Добавить заметку
              </Button>
            </DialogTrigger>
            <ProfileAddNote setOpen={setIsOpen} onAdd={onAdd} userId={userId}></ProfileAddNote>
          </Dialog>
        </div>
        <div className="max-h-[400px] overflow-auto">
          <ProfileNotes onDelete={onDelete} onEdit={onEdit} notes={notes}></ProfileNotes>
        </div>
      </Card>
    </Card>
  );
};
