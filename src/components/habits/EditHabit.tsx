/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { Minus, Pencil, Plus } from 'lucide-react';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

import { Textarea } from '@/components/ui/textarea';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type EditHabitDialogProps = {
  id: number;
  title: string;
  description?: string;
  targetDays: number;
  color?: string;
  size: number;
  completedDays: number;
  onUpdate: (habit: {
    id: number;
    title: string;
    description?: string;
    targetDays: number;
    color?: string;
  }) => void;
  onUpdateProgress: (completed: boolean) => void;
};
const colorSchema = {
  red: 'bg-red-500',
  green: 'bg-green-500',
  blue: 'bg-blue-500',
  yellow: 'bg-yellow-500',
  indigo: 'bg-indigo-500',
  pink: 'bg-pink-500',
  purple: 'bg-purple-500',
  teal: 'bg-teal-500',
} as any;

const EditHabitDialog: React.FC<EditHabitDialogProps> = ({
  id,
  title,
  description,
  targetDays,
  color,
  onUpdate,
  size,
  completedDays,
  onUpdateProgress,
}) => {
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedDescription, setUpdatedDescription] = useState(description);
  const [updatedTargetDays, setUpdatedTargetDays] = useState(targetDays);
  const [updatedColor, setUpdatedColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/habits', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          title: updatedTitle,
          description: updatedDescription,
          targetDays: updatedTargetDays,
          color: updatedColor,
          completed: updatedTargetDays <= completedDays,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update habit');
      }

      const updatedHabit = await res.json();
      console.log('Habit updated successfully:', updatedHabit);

      onUpdate(updatedHabit);
      onUpdateProgress(updatedTargetDays <= completedDays);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating habit:', error);
    }
  };

  const handleOpenChange = (open: any) => {
    setIsOpen(open);
    if (open) {
      setUpdatedTitle(title);
      setUpdatedDescription(description);
      setUpdatedTargetDays(targetDays);
      setUpdatedColor(color);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setUpdatedTargetDays(value);
    } else {
      setUpdatedTargetDays(1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger>
        <Pencil size={size} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Редактирование привычки</DialogTitle>
          <DialogDescription>Отредактируй параметры своей привычки</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Title" className="text-right">
              Название
            </Label>
            <Input
              id="title"
              className="col-span-3"
              value={updatedTitle}
              onChange={(e) => setUpdatedTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="Title" className="text-right">
              Описание
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              value={updatedDescription}
              onChange={(e) => setUpdatedDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4 relative">
            <Label htmlFor="Title" className="text-right">
              Цель (Дни)
            </Label>

            <Input
              id="title"
              type="number"
              className="col-span-3"
              min={1}
              value={updatedTargetDays}
              onChange={handleChange}
            />
            <div className="absolute flex right-0 mr-4">
              <Button
                onClick={() => setUpdatedTargetDays((prev) => prev + 1)}
                variant="outline"
                className=" h-full px-3 rounded-r-none"
              >
                <Plus />
              </Button>
              <Button
                onClick={() => setUpdatedTargetDays((prev) => Math.max(prev - 1, 1))}
                variant="outline"
                className="h-full px-3 rounded-l-none"
              >
                <Minus />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right flex justify-end items-center gap-2">
              <span>Цвет:</span>
              {updatedColor && (
                <div
                  className={`w-6 h-6 rounded-md ${colorSchema[updatedColor] || 'bg-gray-500'}`}
                ></div>
              )}
            </Label>
            <Select onValueChange={(value: string) => setUpdatedColor(value)}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Выберите цвет" />
              </SelectTrigger>
              <SelectContent className="col-span-3">
                <SelectGroup>
                  <SelectLabel>Цвета</SelectLabel>
                  <SelectItem value="red">Красный</SelectItem>
                  <SelectItem value="green">Зеленый</SelectItem>
                  <SelectItem value="blue">Синий</SelectItem>
                  <SelectItem value="yellow">Желтый</SelectItem>
                  <SelectItem value="indigo">Индиго</SelectItem>
                  <SelectItem value="pink">Розовый</SelectItem>
                  <SelectItem value="purple">Фиолетовый</SelectItem>
                  <SelectItem value="teal">Бирюзовый</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={handleUpdate}>Добавить</Button>
      </DialogContent>
    </Dialog>
  );
};

export default EditHabitDialog;
