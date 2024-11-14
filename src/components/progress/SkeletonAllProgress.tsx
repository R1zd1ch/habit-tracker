import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const AllProgressSkeleton: FC = () => {
  return (
    <Card className="flex flex-col gap-2 min-h-[275px] sm:min-h-[315px] shadow-black/20 shadow-lg">
      <CardHeader className="items-center pb-2">
        <CardTitle>Общий прогресс</CardTitle>
        <CardDescription>Диаграмма общего прогресса</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center pb-0 mt-4">
        {/* Skeleton for Pie Chart */}
        <div className="relative flex justify-center items-center mt-4">
          <Skeleton className="w-36 h-36 rounded-full" /> {/* Circle Skeleton */}
          <Skeleton className="absolute w-10 h-6 rounded-md" /> {/* Percentage Skeleton */}
        </div>
      </CardContent>
    </Card>
  );
};

export default AllProgressSkeleton;
