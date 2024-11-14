/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import db from '@/db/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const userId = parseInt(searchParams.get('userId'));
    const notes = await db.note.findMany({
      where: {
        userId,
      },
    });
    if (!notes) {
      return NextResponse.json({ message: 'No notes found' }, { status: 404 });
    }
    return NextResponse.json(notes);
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ message: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, content } = await request.json();
    const note = await db.note.create({
      data: {
        userId,
        title,
        content,
      },
    });
    return NextResponse.json(note);
  } catch (error) {
    console.error('Error creating note:', error);
    return NextResponse.json({ message: 'Failed to create note' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams }: any = new URL(request.url);
    const noteId = parseInt(searchParams.get('noteId'));
    const note = await db.note.delete({
      where: {
        id: noteId,
      },
    });
    return NextResponse.json(note);
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json({ message: 'Failed to delete note' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { noteId, title, content } = await request.json();
    const note = await db.note.update({
      where: {
        id: noteId,
      },
      data: {
        title,
        content,
      },
    });
    return NextResponse.json(note);
  } catch (error) {
    console.error('Error updating note:', error);
    return NextResponse.json({ message: 'Failed to update note' }, { status: 500 });
  }
}
