/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { Check, X } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import EditHabitDialog from './EditHabit';
import { MoreHabit } from './MoreHabit';

type Progress = {
  id: number;
  habitId: number;
  date: string;
  completed: boolean;
  completedDays: number;
  createdAt: string;
  updatedAt: string;
};

type HabitProps = {
  id: number;
  title: string;
  description?: string;
  targetDays: number;
  color?: string;
  createdAt: string;
  progress: Progress | Progress[];
  userId: number;
  onUpdate: (habit: {
    id: number;
    title: string;
    description?: string;
    targetDays: number;
    color?: string;
  }) => void;
  onDelete: (id: number) => void;
  onProgress: () => void;
};

const HabitCard: React.FC<HabitProps> = ({
  id,
  title,
  description,
  targetDays,
  color,
  onUpdate,
  onDelete,
  createdAt,
  progress,
  userId,
}) => {
  const [currentProgress, setCurrentProgress] = useState<Progress | null>(null);

  // Ensure `currentProgress` is set to the first item if `progress` is an array
  useEffect(() => {
    const resolvedProgress = Array.isArray(progress) ? progress[0] : progress;
    if (resolvedProgress && resolvedProgress !== currentProgress) {
      setCurrentProgress(resolvedProgress);
      console.log('Progress updated from props:', resolvedProgress);
    }
  }, []);

  const onUpdateProgress = (completed: boolean) => {
    setCurrentProgress(currentProgress?.id ? { ...currentProgress, completed } : null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/habits?userId=${userId}&habitId=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onDelete(id);
      }
    } catch (error) {
      console.error('Error deleting habit:', error);
    }
  };

  const handleSuccessProgressDays = async () => {
    try {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          habitId: id,
          completedDays: (currentProgress?.completedDays || 0) + 1,
          completed: (currentProgress?.completedDays || 0) + 1 >= targetDays,
          date: new Date().toISOString(),
          targetDays: targetDays,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentProgress(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return currentProgress?.completed ? (
    <Card className="flex sm:flex-row p-4 pt-4 px-4 sm:px-10 sm:pt-6 gap-1 shadow-lg rounded-lg">
      <div className="flex flex-row sm:gap-4">
        <div className="flex flex-col items-center justify-center w-16">
          <div className={`w-12 h-12 rounded-2xl bg-${color}-500 mb-2`} />
          <CardDescription className="text-xs text-center">
            Прогресс:{' '}
            <span className="font-semibold">
              {currentProgress.completedDays} / {targetDays}
            </span>
          </CardDescription>
        </div>

        <CardHeader className="flex-1 max-w-[140px] sm:max-w-[450px] pt-0 pb-0 whitespace-normal break-words">
          <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{title}</CardTitle>
          <CardDescription className="text-sm whitespace-normal break-words overflow-hidden text-ellipsis max-h-[2.5em] line-clamp-2">
            {description || 'Описание отсутствует'}
          </CardDescription>
          <CardDescription className="pt-2 text-green-500">Выполнено!</CardDescription>
        </CardHeader>
      </div>
      <div className="flex justify-center flex-col sm:flex-row items-center ml-auto mr-3 gap-3">
        <MoreHabit
          size={18}
          id={id}
          title={title}
          description={description}
          targetDays={targetDays}
          color={color}
          createdAt={createdAt}
          completedDays={currentProgress?.completedDays || 0}
        />

        <button className="rounded-full" aria-label="Удалить привычку" onClick={handleDelete}>
          <X size={18} />
        </button>

        <EditHabitDialog
          size={18}
          id={id}
          title={title}
          description={description}
          targetDays={targetDays}
          color={color}
          onUpdate={onUpdate}
          completedDays={currentProgress?.completedDays || 0}
          onUpdateProgress={onUpdateProgress}
        />
      </div>
    </Card>
  ) : (
    <Card className="flex flex-col sm:flex-row p-4 pt-4 px-4 sm:px-10 sm:pt-6 gap-1 shadow-lg rounded-lg">
      <div className="flex flex-row sm:gap-4">
        <div className="flex flex-col items-center justify-center w-16">
          <div className={`w-12 h-12 rounded-2xl bg-${color}-500 mb-2`} />
          <CardDescription className="text-xs text-center">
            Прогресс:{' '}
            <span className="font-semibold">
              {currentProgress?.completedDays || 0} / {targetDays}
            </span>
          </CardDescription>
        </div>

        <CardHeader className="flex-1 max-w-[200px] sm:max-w-[450px] pt-0 whitespace-normal break-words">
          <CardTitle className="text-lg font-semibold mb-1 line-clamp-2">{title}</CardTitle>
          <CardDescription className="text-sm whitespace-normal break-words overflow-hidden text-ellipsis max-h-[2.5em] line-clamp-2">
            {description || 'Описание отсутствует'}
          </CardDescription>
        </CardHeader>
      </div>

      <div className="flex items-center justify-center gap-6 sm:mt-0 sm:ml-auto">
        <button
          className="rounded-full"
          aria-label="Отметить как выполненную"
          onClick={handleSuccessProgressDays}
        >
          <Check size={20} />
        </button>
        <button className="rounded-full" aria-label="Удалить привычку" onClick={handleDelete}>
          <X size={20} />
        </button>
        <div className="ml-auto">
          <EditHabitDialog
            size={20}
            id={id}
            title={title}
            description={description}
            targetDays={targetDays}
            color={color}
            onUpdate={onUpdate}
            completedDays={currentProgress?.completedDays || 0}
            onUpdateProgress={onUpdateProgress}
          />
        </div>
        <MoreHabit
          id={id}
          size={20}
          title={title}
          description={description}
          targetDays={targetDays}
          color={color}
          createdAt={createdAt}
          completedDays={currentProgress?.completedDays || 0}
        />
      </div>
    </Card>
  );
};

export default HabitCard;
