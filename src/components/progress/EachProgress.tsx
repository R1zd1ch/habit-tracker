/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
interface EachProgressProps {
  props: any;
}

const getProgressPercentage = (completedDays: number, targetDays: number) => {
  if (!completedDays) {
    return 0;
  }
  return (completedDays / targetDays) * 100;
};

const EachProgress: FC<EachProgressProps> = ({ props = [] }) => {
  console.log(props);
  console.log('props', getProgressPercentage(props[0].progress.completedDays, props[0].targetDays));
  console.log('propsik', props[0].targetDays, props[0].progress[0].completedDays);
  return (
    <Card className="flex flex-col gap-2 min-h-[275px] sm:min-h-[317px] shadow-black/20 shadow-lg">
      <CardHeader className="items-center pb-2">
        <CardTitle>Прогресс по каждой привычке</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 overflow-y-auto max-h-[250px]">
        {props.map((item: any) => (
          <div key={item.id}>
            <Card className="h-[50px] dark:bg-secondary bg-card flex flex-col rounded-lg shadow-lg shadow-black/20 relative gap-1">
              <p className="text-center font-semibold">{item.title}</p>
              <p className="absolute right-0 top-0 mr-6 font-semibold">
                {Math.round(
                  getProgressPercentage(item.progress[0]?.completedDays || 0, item.targetDays),
                )}{' '}
                %
              </p>

              <div className="px-5">
                <Progress
                  className=" w-full h-[10px] rounded-lg dark:bg-primary/20 bg-black/30 "
                  value={getProgressPercentage(
                    item.progress[0]?.completedDays || 0,
                    item.targetDays,
                  )}
                />
              </div>
            </Card>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EachProgress;
