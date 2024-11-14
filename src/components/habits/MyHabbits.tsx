/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Card, CardContent, CardHeader } from '../ui/card';
import BreadCrumb from '@/utils/makeBreadCrum';
import { AddHabit } from './AddHabit';
import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSession } from 'next-auth/react';
import Habit from './Habit';

const pathnames = [
  { label: 'Главная', url: '/' },
  { label: 'Мои привычки', url: '/habits' },
];

export const Habits = () => {
  const [habits, setHabits] = useState<any[]>([]);
  const { data: session, status }: any = useSession();
  const [sortByTime, setSortByTime] = useState('');
  const [colorFilter, setColorFilter] = useState('');
  const [byDate, setByDate] = useState('');
  const userId = session?.user?.id;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && userId) {
      const fetchHabits = async () => {
        try {
          const response = await fetch(`/api/habits?userId=${userId}`);
          const data = await response.json();
          setHabits(data);
          console.log(data);
        } catch (error) {
          console.error('Error fetching habits:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchHabits();
    }
  }, [status, userId]);

  const handleAddHabit = (newHabit: any) => {
    setHabits((prevHabits) => [newHabit, ...prevHabits]);
  };
  const updateHabit = (updatedHabit: any) => {
    setHabits((prevHabits) =>
      prevHabits.map((habit) => (habit.id === updatedHabit.id ? updatedHabit : habit)),
    );
  };
  const onProgress = () => {
    setHabits((prevHabits) => [...prevHabits]);
  };
  const onDelete = (id: number) => {
    setHabits((prevHabits) => prevHabits.filter((habit) => habit.id !== id));
  };
  const sortedHabits = [...habits]
    .sort((a, b) => {
      if (sortByTime === 'asc') {
        return a.targetDays - b.targetDays;
      } else if (sortByTime === 'desc') {
        return b.targetDays - a.targetDays;
      } else {
        return 0;
      }
    })
    .filter((habit) => {
      if (colorFilter === 'default') {
        return true;
      }
      if (colorFilter) {
        return habit.color === colorFilter;
      } else {
        return true;
      }
    })
    .sort((a, b) => {
      if (byDate === 'desc') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (byDate === 'asc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return 0;
      }
    });

  return (
    <>
      <Card className="min-h-full m-2 sm:m-5 shadow-black/20 shadow-lg">
        <CardHeader className="p-5 pb-0">
          <div>
            <BreadCrumb items={pathnames} />
          </div>
        </CardHeader>
        <CardHeader className="text-2xl font-bold">Мои привычки</CardHeader>
        <CardContent>
          <Card className="flex flex-col justify-center items-center md:flex-row mt-2 p-4 gap-5">
            <span>Фильтры:</span>
            <Select onValueChange={(v) => setColorFilter(v)}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="Цвет" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Без фильтра</SelectItem>
                <SelectItem value="red">Красный</SelectItem>
                <SelectItem value="green">Зелёный</SelectItem>
                <SelectItem value="blue">Синий</SelectItem>
                <SelectItem value="yellow">Жёлтый</SelectItem>
                <SelectItem value="indigo">Индиго</SelectItem>
                <SelectItem value="pink">Розовый</SelectItem>
                <SelectItem value="purple">Фиолетовый</SelectItem>
                <SelectItem value="teal">Бирюзовый</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setSortByTime(v)}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="По длительности" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Без фильтра</SelectItem>
                <SelectItem value="asc">По возрастанию</SelectItem>
                <SelectItem value="desc">По убыванию</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setByDate(v)}>
              <SelectTrigger className="w-[240px]">
                <SelectValue placeholder="По времени создания" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Без фильтра</SelectItem>
                <SelectItem value="asc">С недавних</SelectItem>
                <SelectItem value="desc">С давних</SelectItem>
              </SelectContent>
            </Select>
            <div className="sm:ml-auto">
              <AddHabit onAddHabit={handleAddHabit} session={session}></AddHabit>
            </div>
          </Card>
          <Card className="h-full mt-2 p-2 mx-0 sm:p-4 gap-5">
            <div className="flex flex-col gap-5">
              {isLoading ? (
                <p className="text-center text-xl font-semibold">Загрузка привычек...</p>
              ) : sortedHabits.length === 0 ? (
                <p className="text-center text-xl font-semibold">Нет привычек</p>
              ) : (
                sortedHabits.map((habit) => (
                  <div key={habit.id}>
                    <Habit
                      {...habit}
                      onUpdate={updateHabit}
                      onDelete={onDelete}
                      onProgress={onProgress}
                      userId={userId}
                    />
                  </div>
                ))
              )}
            </div>
          </Card>
        </CardContent>
      </Card>
    </>
  );
};
