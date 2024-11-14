/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import DeleteNote from './ProfileDeleteNote';
import EditNote from './ProfileEditNote';
import React, { memo } from 'react';

const ProfileNotes = memo(
  ({
    notes,
    onEdit,
    onDelete,
  }: {
    notes: any;
    onEdit: (updatedNote: any) => void;
    onDelete: (id: number) => void;
  }) => {
    return notes ? (
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-2 sm:p-4">
        {notes.map((note: any) => (
          <Card key={note.id} className="min-h-[200px] max-h-[200px] relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{note.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-xs pt-0 break-words max-w-[250px]">
              {note.content}
            </CardContent>
            <div className="absolute bottom-4 right-4 flex flex-col gap-4">
              <EditNote onEdit={onEdit} note={note} />
              <DeleteNote onDelete={onDelete} id={note.id}></DeleteNote>
            </div>
          </Card>
        ))}
      </div>
    ) : (
      <div>Нет заметок</div>
    );
  },
);
ProfileNotes.displayName = 'ProfileNotes';

export default ProfileNotes;
