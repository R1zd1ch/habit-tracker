/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import { Cell, Label, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import adjustColorBrightness from '@/utils/adjustColorBrightness';
interface AllProgressProps {
  props: any;
}

const AllProgress: FC<AllProgressProps> = ({ props = [] }) => {
  const [allProgress, setAllProgress] = useState(0);
  const [allTarget, setAllTarget] = useState(0);
  const color = 'green';
  useEffect(() => {
    if (Array.isArray(props)) {
      const AgregatingProps = props.reduce(
        (acc: any, cur: any) => {
          acc.progress += cur.progress;
          acc.target += cur.target;
          return acc;
        },
        { progress: 0, target: 0 },
      );
      setAllProgress(AgregatingProps.progress);
      setAllTarget(AgregatingProps.target);
    }
  }, [props]);
  const chartData = [
    { name: 'Completed', value: allProgress, color: '#272c30' },
    { name: 'Remaining', value: allTarget, color: 'gray' },
  ];
  const chartConfig = {
    completed: {
      label: 'Completed',
      color: adjustColorBrightness(color || 'hsl(var(--chart-1))', 100),
    },
    remaining: { label: 'Remaining', color: adjustColorBrightness('hsl(var(--chart-2))') },
  } satisfies ChartConfig;

  useEffect(() => {
    console.log(allProgress, allTarget);
    console.log(props);
  }, [allProgress, allTarget]);
  return (
    <Card className="flex-1 flex min-h-[275px] sm:min-h-[300px] flex-col gap-2 shadow-black/20 shadow-lg">
      <CardHeader className="items-center pb-0">
        <CardTitle>Общий прогресс</CardTitle>
        <CardDescription>Диаграмма общего прогресса</CardDescription>
      </CardHeader>
      <CardContent className=" pb-0">
        {props.length === 0 && (
          <CardDescription className="text-center">У вас ещё нет привычек</CardDescription>
        )}
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              ></ChartTooltip>
              <Pie data={chartData} dataKey="value" innerRadius={40} outerRadius={70}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {Math.round((allProgress / allTarget) * 100).toLocaleString()}%
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AllProgress;
