'use client';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Home() {
  const pathname = usePathname();
  const paths = pathname.split('/');

  return (
    <div className="flex flex-col m-5 sm:m-2 h-full shadow-black/10 shadow-xl">
      <Card className="flex-grow">
        <CardHeader>
          {pathname === '/' ? <Link href={'/'}>Главная</Link> : paths[paths.length - 1]}
        </CardHeader>
        <CardContent>
          <p className="text-2xl">Добро пожаловать в трекер привычек</p>
        </CardContent>
      </Card>
    </div>
  );
}
