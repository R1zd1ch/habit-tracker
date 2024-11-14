'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import BreadCrumb from '@/utils/makeBreadCrum';

export default function Home() {
  const pathnames = [{ label: 'Главная', url: '/' }];

  return (
    <div className="flex flex-col m-2 sm:m-5 min-h-[500px] shadow-black/20 shadow-lg">
      <Card className="flex-grow">
        <CardHeader className="p-5 pb-0">
          <div>
            <BreadCrumb items={pathnames} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-2xl">Добро пожаловать в трекер привычек</p>
        </CardContent>
      </Card>
    </div>
  );
}
