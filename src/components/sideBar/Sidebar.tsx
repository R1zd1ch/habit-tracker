'use client';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { ChevronUp, Home, LoaderCircle, Notebook } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useState } from 'react';
import { ModeToggle } from '../toggle-theme';

// Menu items.
const items = [
  {
    title: 'Главная',
    url: '/',
    icon: Home,
  },
  {
    title: 'Мои привычки',
    url: '/my-habits',
    icon: Notebook,
  },
  {
    title: 'Прогресс',
    url: '/progress',
    icon: LoaderCircle,
  },
];

export function AppSidebar() {
  const { data: session, status }: any = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase();
  const [name, setName] = useState(session?.user?.name);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    setName(session?.user?.name);
  }, [session]);

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="text-2xl ">
            <div className="relative">
              Habit-Tracker
              <div className="absolute top-0 right-0">
                <ModeToggle></ModeToggle>
              </div>
            </div>
          </SidebarHeader>
          <SidebarGroupLabel className="text-md">Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link className="" href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {!isLoaded || status === 'loading' ? (
              // Skeleton loader while session data is loading
              <Skeleton className="flex items-center space-x-2 h-16 justify-center bg-secondary">
                <Skeleton className="h-12 w-12 rounded-full bg-neutral-400 dark:bg-neutral-500" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[250px] bg-neutral-400 dark:bg-neutral-500" />
                </div>
              </Skeleton>
            ) : session ? (
              // Меню для вошедшего пользователя
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-16">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`${session?.user?.image}`} />
                      <AvatarFallback className="border-2">{avatarFallback}</AvatarFallback>
                    </Avatar>
                    {name}
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]">
                  <Link href={'/profile'}>
                    <DropdownMenuItem>
                      <span>Профиль</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href={'/settings'}>
                    <DropdownMenuItem>
                      <span>Настройки</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem onClick={async () => signOut()}>
                    <span>Выйти</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Кнопка "Войти" для неавторизованных пользователей
              <Link href={'/sign-in'}>
                <SidebarMenuButton className="h-16">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={`${session?.user?.image}`} />
                    <AvatarFallback className="border-2">U</AvatarFallback>
                  </Avatar>{' '}
                  Войти
                </SidebarMenuButton>
              </Link>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
