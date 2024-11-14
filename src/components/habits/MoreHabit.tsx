import { Ellipsis } from 'lucide-react';
import { Pie, PieChart, Cell } from 'recharts';
import { format } from 'date-fns';
import calculateMissedDays from '@/utils/dateWasted';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import adjustColorBrightness from '@/utils/adjustColorBrightness';

type MoreHabitProps = {
  id: number;
  title: string;
  description?: string;
  targetDays: number;
  completedDays: number;
  color?: string;
  createdAt: string;
  size: number;
};

export function MoreHabit({
  title,
  description,
  targetDays,
  completedDays,
  color,
  createdAt,
  size,
}: MoreHabitProps) {
  const chartData = [
    { name: 'Completed', value: completedDays, color: color || '#4CAF50' },
    { name: 'Remaining', value: targetDays - completedDays, color: '#E0E0E0' },
  ];

  const chartConfig = {
    completed: {
      label: 'Completed',
      color: adjustColorBrightness(color || 'hsl(var(--chart-1))', 100),
    },
    remaining: { label: 'Remaining', color: adjustColorBrightness('hsl(var(--chart-2))') },
  } satisfies ChartConfig;

  console.log(createdAt);
  const formattedDate = format(new Date(createdAt), 'dd.MM.yy');
  const missedDays = calculateMissedDays(createdAt, completedDays);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className=" rounded-full">
          <Ellipsis size={size} className="" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md p-6 rounded-lg shadow-lg ">
        <DialogHeader className="whitespace-normal break-words line-clamp-6">
          <DialogTitle className="text-2xl font-semibold mb-2 ">
            Больше информации о <span className="text-primary">{title}</span>
          </DialogTitle>
          {description && (
            <DialogDescription className=" whitespace-normal break-words line-clamp-6 min-h-7">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        <Card className="flex flex-col">
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={adjustColorBrightness(entry.color, 70, 200)}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>

          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-2 font-medium leading-none">
              Прогресс привычки:
            </div>
            <div className="leading-none text-muted-foreground">
              Завершено {completedDays} из {targetDays} дней
            </div>
            <div className="flex items-center gap-2 font-medium leading-none">
              <span>Создано: {formattedDate}</span>
            </div>
            {typeof missedDays === 'number' ? (
              <div className="flex items-center gap-2 font-medium leading-none">
                Пропущено:
                <span className="leading-none text-muted-foreground">{missedDays} дней</span>
              </div>
            ) : null}
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
