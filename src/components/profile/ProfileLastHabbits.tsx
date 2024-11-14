/* eslint-disable @typescript-eslint/no-explicit-any */
import { Check } from 'lucide-react';
import { Card, CardTitle } from '../ui/card';

const ProfileLastHabits = ({ habits, isLoading }: { habits: any; isLoading: boolean }) => {
  const filteredHabits = habits
    .map((habit: any) => {
      if (!habit?.progress?.length) {
        habit.progress = [{ completedDays: 0, id: 0 }];
      }
      return habit;
    })
    .filter((habit: any) => habit?.progress?.length > 0)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  console.log(filteredHabits);

  return isLoading ? (
    <CardTitle className="text-center text-md font-semibold">Загрузка привычек...</CardTitle>
  ) : filteredHabits.length === 0 ? (
    <CardTitle className="text-center text-md font-semibold">Нет привычек</CardTitle>
  ) : (
    <div className="flex flex-col gap-2">
      {filteredHabits.slice(0, 3).map((habit: any) => (
        <Card className="p-4 relative" key={habit.id}>
          <div className="text-left sm:text-center flex items-center sm:justify-center gap-1">
            <div
              className={`hidden lg:block absolute rounded-md left-4 w-16 h-5 bg-${habit.color}-500`}
            ></div>
            <div className="max-w-[90px] sm:w-auto overflow-hidden text-ellipsis whitespace-nowrap inline-block ">
              {habit.title}
            </div>
            - <span className="hidden sm:inline"> Выполнено </span>{' '}
            {habit.progress[0].completedDays} раз из {habit.targetDays}
          </div>
          <Check className="text-green-500 absolute right-2 top-4 sm:right-4"></Check>
        </Card>
      ))}
    </div>
  );
};

export default ProfileLastHabits;
