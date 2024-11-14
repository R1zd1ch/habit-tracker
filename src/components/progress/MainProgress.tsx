/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { FC, useEffect, useState } from 'react';
import * as Card from '../ui/card';
import BreadCrumb from '@/utils/makeBreadCrum';
import AllProgress from './AllProgress';
import { useSession } from 'next-auth/react';
import EachProgress from './EachProgress';
import SkeletonEachProgress from './SkeletonEachProgress';
import SkeletonAllProgress from './SkeletonAllProgress';
import { Skeleton } from '../ui/skeleton';
const pathnames = [
  { label: 'Главная', url: '/' },
  { label: 'Прогресс', url: '/progress' },
];

const HabitTrackerCard: FC = () => {
  const { data: session, status } = useSession();
  const [habits, setHabits] = useState<any>();
  const userId = (session?.user as any)?.id;
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (status === 'authenticated' && userId) {
      const fetchHabits = async () => {
        try {
          const response = await fetch(`/api/habits?userId=${userId}`);
          const data = await response.json();

          if (response.ok) {
            const progressArray = data.map((habit: any) => {
              if (!habit.progress[0]) {
                return { progress: 0, target: habit.targetDays };
              }
              const { completedDays } = habit.progress[0];
              console.log(habit.progress);
              return { progress: completedDays, target: habit.targetDays };
            });
            setHabits(data);
            setProgress(progressArray);
            console.log(data);
          }
        } catch (error) {
          console.error('Error fetching habits:', error);
        }
      };
      fetchHabits();
    }
  }, [status, userId]);

  const completedHabits = habits?.filter((habit: any) => habit?.progress[0]?.completed);
  const unCompletedHabits = habits?.filter((habit: any) => !habit?.progress[0]?.completed);

  return (
    <Card.Card className="flex flex-col m-2 sm:m-5 min-h-[500px] shadow-black/20 shadow-lg">
      <Card.CardHeader className="p-5 pb-0">
        <div>
          <BreadCrumb items={pathnames} />
        </div>
        <h2 className="text-2xl font-semibold mt-3">Ваш Прогресс по Привычкам</h2>
      </Card.CardHeader>

      <Card.CardContent className="p-5">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="sm:w-[465px]">
            {habits ? (
              <div>
                <AllProgress props={progress}></AllProgress>
              </div>
            ) : (
              <SkeletonAllProgress></SkeletonAllProgress>
            )}
          </div>
          <div className="flex-1 gap-2 flex flex-col">
            {habits ? (
              habits.length > 0 ? (
                <EachProgress props={habits}></EachProgress>
              ) : (
                <Card.Card className="flex flex-col gap-2 min-h-[275px] sm:min-h-[317px] shadow-black/20 shadow-lg">
                  <Card.CardHeader className="items-center pb-2">
                    <Card.CardTitle>Прогресс по каждой привычке</Card.CardTitle>
                    <Card.CardDescription>
                      У вас ещё нет привычек, создайте какую-нибудь
                    </Card.CardDescription>
                  </Card.CardHeader>
                </Card.Card>
              )
            ) : (
              <SkeletonEachProgress></SkeletonEachProgress>
            )}
          </div>
        </div>

        <Card.Card className="flex flex-col min-h-[125px] mt-6 shadow-lg shadow-black/20">
          <Card.CardHeader>
            <Card.CardTitle>Статистика</Card.CardTitle>
          </Card.CardHeader>
          <Card.CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="col-span-1 text-center">
                {habits ? (
                  <p className="font-bold text-lg">Всего привычек: {habits?.length}</p>
                ) : (
                  <Skeleton className="h-6 w-64 mx-auto" />
                )}
              </div>
              <div className="col-span-1 text-center">
                {habits ? (
                  <p className="font-bold text-lg">
                    Завершённые привычки: {completedHabits?.length}
                  </p>
                ) : (
                  <Skeleton className="h-6 w-64 mx-auto" />
                )}
              </div>
              <div className="col-span-1 text-center">
                {habits ? (
                  <p className="font-bold text-lg">
                    Незавершённые привычки: {unCompletedHabits?.length}
                  </p>
                ) : (
                  <Skeleton className="h-6 w-64 mx-auto" />
                )}
              </div>
            </div>
          </Card.CardContent>
        </Card.Card>
      </Card.CardContent>
    </Card.Card>
  );
};

export default HabitTrackerCard;
