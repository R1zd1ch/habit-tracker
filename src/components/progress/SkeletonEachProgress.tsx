import { FC } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const LoadingSkeleton: FC = () => {
  return (
    <Card className="flex flex-col gap-2 min-h-[275px] sm:min-h-[317px] shadow-black/20 shadow-lg">
      <CardHeader className="items-center pb-2">
        <CardTitle>Прогресс по каждой привычке</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-y-auto max-h-[250px]">
        {[...Array(4)].map((_, index) => (
          <Skeleton
            key={index}
            className="h-[50px] flex flex-col rounded-lg items-center shadow-lg shadow-black/20 p-2 light:bg-neutral-300 gap-1 relative"
          >
            <Skeleton className="w-1/2 h-4 mb-2 dark:bg-neutral-500 bg-neutral-400" />
            <Skeleton className=" h-4 w-[25px] rounded-lg absolute right-0 top-0 mr-6 mt-2 dark:bg-neutral-500 bg-neutral-400"></Skeleton>
            <Skeleton className="w-full h-[10px] rounded-lg dark:bg-neutral-500 bg-neutral-400" />
          </Skeleton>
        ))}
      </CardContent>
    </Card>
  );
};

export default LoadingSkeleton;
