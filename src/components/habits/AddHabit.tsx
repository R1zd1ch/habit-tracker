/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

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

export const AddHabit = ({
  onAddHabit,
  session,
}: {
  onAddHabit: (habit: any) => void;
  session: any;
}) => {
  const [title, setTitle] = useState('');
  const [color, setColor] = useState<any>('');
  const [description, setDescription] = useState('');
  const [targetDays, setTargetDays] = useState('');
  const [customDuration, setCustomDuration] = useState('');
  const [isCustomInput, setIsCustomInput] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectChange = (value: string) => {
    if (value === 'custom') {
      setIsCustomInput(true);
    } else {
      setTargetDays(value);
      setIsCustomInput(false);
      setCustomDuration('');
    }
  };

  const handleAddHabit = async () => {
    const finalTargetDays: any =
      isCustomInput && customDuration ? parseInt(customDuration) : parseInt(targetDays);

    if (!title || !color || isNaN(finalTargetDays)) {
      console.error('Некоторые обязательные поля отсутствуют');
      return;
    }
    const { id } = session?.user as {
      id: number;
    };
    const newHabit = {
      title,
      color,
      description,
      targetDays: parseInt(finalTargetDays, 10),
      userId: id ?? 1,
    };
    console.log(JSON.stringify(newHabit));

    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newHabit),
      });

      if (response.ok) {
        const habit = await response.json();
        onAddHabit(habit);
        setIsOpen(false);
      } else {
        console.error('Failed to add habit');
      }
    } catch (error) {
      console.error('Ошибка при добавлении привычки:', error);
    }
  };

  const handleOpenChange = (open: any) => {
    setIsOpen(open);
    if (open) {
      setTitle('');
      setColor('');
      setDescription('');
      setTargetDays('');
      setIsCustomInput(false);
      setCustomDuration('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)}>Добавить привычку</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mt-6">Добавить новую привычку</DialogTitle>
          <DialogDescription>
            Введите её информацию и нажмите &quot;Добавить&quot;.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Название
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Описание
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="targetDays" className="text-right">
              Цель (дни)
            </Label>
            <Select onValueChange={handleSelectChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Укажите продолжительность" />
              </SelectTrigger>
              <SelectContent className="col-span-3">
                <SelectGroup>
                  <SelectLabel>Дни</SelectLabel>
                  <SelectItem value="1">День</SelectItem>
                  <SelectItem value="7">Неделя</SelectItem>
                  <SelectItem value="30">Месяц</SelectItem>
                  <SelectItem value="180">Полгода</SelectItem>
                  <SelectItem value="365">Год</SelectItem>
                  <SelectItem value="custom">Другое значение</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {isCustomInput && (
              <div className="col-span-3 mt-2">
                <Input
                  type="number"
                  placeholder="Введите количество дней"
                  value={customDuration}
                  min={1}
                  onChange={(e) => setCustomDuration(e.target.value)}
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="color" className="text-right flex justify-end items-center gap-2">
              <span>Цвет:</span>
              <div className={`w-6 h-6 rounded-md ${colorSchema[color]}`}></div>
            </Label>
            <Select onValueChange={(value: string) => setColor(value)}>
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
        <DialogFooter>
          <Button onClick={handleAddHabit}>Добавить</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
