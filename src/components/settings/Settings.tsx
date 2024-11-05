import { Card, CardHeader } from '../ui/card';
import BreadCrumb from '@/utils/makeBreadCrum';

const pathnames = [
  {
    label: 'Главная',
    url: '/',
  },
  {
    label: 'Настройки',
    url: '/settings',
  },
];

export const Settings = () => {
  return (
    <Card className="m-2 sm:m-5 h-full shadow-black/20 shadow-lg ">
      <CardHeader className="p-5 pb-0">
        <div>
          <BreadCrumb items={pathnames} />
        </div>
      </CardHeader>
    </Card>
  );
};
