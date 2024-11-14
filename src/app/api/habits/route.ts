/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'));
    console.log(userId);

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const habits = await db.habit.findMany({
      where: {
        userId,
      },
      include: {
        progress: true,
      },
    });

    if (!habits) {
      return NextResponse.json({ message: 'No habits found' }, { status: 404 });
    }

    return NextResponse.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    return NextResponse.json({ message: 'Failed to fetch habits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, description, targetDays, color } = await request.json();
    console.log('Received data:', { userId, title, description, targetDays, color });

    if (!userId || !title || !targetDays) {
      return NextResponse.json(
        { message: 'User ID, title, and targetDays are required' },
        { status: 400 },
      );
    }

    if (typeof userId !== 'number' || typeof title !== 'string' || typeof targetDays !== 'number') {
      return NextResponse.json(
        {
          message:
            'Invalid data types: userId should be a number, title a string, and targetDays a number',
        },
        { status: 400 },
      );
    }

    const habit = await db.habit.create({
      data: {
        userId,
        title,
        description,
        targetDays,
        color,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error('Error creating habit:', error);
    return NextResponse.json({ message: 'Failed to create habit' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const { id, title, description, targetDays, color, completed } = await request.json();

  try {
    const updatedHabit = await db.habit.update({
      where: { id },
      data: {
        title,
        description,
        targetDays,
        color,
      },
    });
    const progress = await db.progress.findFirst({
      where: { habitId: updatedHabit.id },
    });

    if (progress) {
      await db.progress.update({
        where: { id: progress.id },
        data: {
          completed,
        },
      });
    }
    console.log(progress);

    return NextResponse.json(updatedHabit, { status: 200 });
  } catch (error) {
    console.error('Error updating habit:', error);
    return NextResponse.json({ message: 'Failed to update habit' }, { status: 500 });
  }
}

/**
 * DELETE /api/habits?userId={userId}&habitId={habitId}
 *
 * Deletes a habit by ID.
 *
 * @param {number} userId - The ID of the user who owns the habit.
 * @param {number} habitId - The ID of the habit to be deleted.
 * @returns {Promise<NextResponse>} The response to the request.
 *
 * @throws {Error} If the request fails, an error is thrown.
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'));
    const habitId = parseInt(searchParams.get('habitId'));

    if (!userId || !habitId) {
      return NextResponse.json({ message: 'User ID and Habit ID are required' }, { status: 400 });
    }

    const habit = await db.habit.findFirst({
      where: {
        id: habitId,
        userId: userId,
      },
    });

    if (!habit) {
      return NextResponse.json({ message: 'Habit not found' }, { status: 404 });
    }
    await db.habit.delete({
      where: {
        id: habitId,
      },
    });

    return NextResponse.json({ message: 'Habit deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting habit:', error);
    return NextResponse.json({ message: 'Failed to delete habit' }, { status: 500 });
  }
}
