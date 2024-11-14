/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';

const ProfileAddNote = ({
  userId,
  onAdd,
  setOpen,
}: {
  userId: number;
  onAdd: (note: any) => void;
  setOpen: (open: boolean) => void;
}) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handleAddNotes = async () => {
    if (!title || !content) {
      return;
    }
    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          title,
          content,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        onAdd(data);
        console.log('Note created:', data);
        setTitle('');
        setContent('');
        setOpen(false);
      } else {
        console.error('Error creating note:', data);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Введите название заметки и текст</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right">
            Название
          </Label>
          <Input
            id="title"
            className="col-span-3"
            value={title}
            maxLength={30}
            minLength={3}
            required
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="grid grid-cols-4 gap-4">
          <Label htmlFor="Описание" className="text-right mt-2">
            Описание
          </Label>
          <Textarea
            id="description"
            className="col-span-3"
            value={content}
            maxLength={135}
            rows={4}
            required
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
      </div>

      <Button onClick={handleAddNotes}>Добавить</Button>
    </DialogContent>
  );
};

export default ProfileAddNote;
