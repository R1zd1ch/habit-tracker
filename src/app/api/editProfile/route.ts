import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

export async function POST(request: NextRequest) {
  try {
    const { userId, name, email, password } = await request.json();
    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        password,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId, name, email, password } = await request.json();

    const user = await db.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        password,
      },
    });
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Failed to update user' }, { status: 500 });
  }
}
