/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import React, { memo } from 'react';

const EditNote = memo(function EditNote({
  note,
  onEdit,
}: {
  note: any;
  onEdit: (editedNote: any) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const handleEditNote = async () => {
    try {
      const response = await fetch(`/api/notes`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          noteId: note.id,
          title: editedTitle,
          content: editedContent,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Note updated:', data);
        onEdit(data);
        setIsOpen(false);
      } else {
        console.error('Error updating note:', data);
      }
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Pencil />
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Изменение заметки</DialogTitle>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Title" className="text-right">
              Изменённое название
            </Label>
            <Input
              id="title"
              className="col-span-3"
              value={editedTitle}
              maxLength={30}
              minLength={3}
              required
              onChange={(e) => setEditedTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="content" className="text-right">
              Изменённое содержание
            </Label>
            <Textarea
              id="content"
              className="col-span-3"
              value={editedContent}
              maxLength={135}
              rows={4}
              required
              onChange={(e) => setEditedContent(e.target.value)}
            />
          </div>
        </div>
        <Button onClick={handleEditNote}>Добавить</Button>
      </DialogContent>
    </Dialog>
  );
});

export default EditNote;
