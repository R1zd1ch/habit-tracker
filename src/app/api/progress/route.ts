/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse, NextRequest } from 'next/server';
import db from '@/db/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const habitId = parseInt(searchParams.get('habitId'));

    if (isNaN(habitId)) {
      return NextResponse.json({ message: 'Invalid habit ID' }, { status: 400 });
    }
    const progress = await db.progress.findFirst({
      where: {
        habitId,
      },
    });
    return NextResponse.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json({ message: 'Failed to fetch progress' }, { status: 500 });
  }
}

// API для обновления или создания прогресса
export async function POST(request: Request) {
  try {
    const { habitId, date, completed, completedDays, targetDays } = await request.json();
    console.log({ habitId, date, completed, completedDays, targetDays });

    // Проверка на наличие необходимых данных
    if (completedDays === undefined || !habitId || !date || typeof completed !== 'boolean') {
      return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
    }

    // Преобразуем дату в формат DateTime
    const progressDate = new Date(date);

    // Поиск существующей записи прогресса по habitId и дате
    const existingProgress = await db.progress.findFirst({
      where: {
        habitId,
      },
    });
    console.log({ existingProgress });
    if (existingProgress) {
      // Обновляем существующий прогресс
      const updatedProgress = await db.progress.update({
        where: { id: existingProgress.id },
        data: {
          completed,
          completedDays:
            existingProgress.completedDays >= targetDays
              ? targetDays
              : existingProgress.completedDays + 1,
        },
      });
      return NextResponse.json(updatedProgress);
    } else {
      // Создаем новый прогресс
      const newProgress = await db.progress.create({
        data: {
          habitId,
          date: progressDate,
          completed,
          completedDays: 1,
        },
      });
      return NextResponse.json(newProgress);
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не удалось обновить прогресс' }, { status: 500 });
  }
}
