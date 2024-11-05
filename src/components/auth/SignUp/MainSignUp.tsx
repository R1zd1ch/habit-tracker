'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignUpSchema } from '@/schema/SignUpSchema';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaGithub, FaGoogle } from 'react-icons/fa';
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { TriangleAlert } from 'lucide-react';

export const SignUp = () => {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    mode: 'all',
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    setPending(true);
    console.log(JSON.stringify(values));
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      setPending(false);
      const data = await res.json();
      toast.success(data.message);
      const signRes = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });
      if (signRes?.ok) {
        router.push('/');
        toast.success('Login successful');
      } else if (signRes?.status === 401) {
        setError('Invalid Credentials');
      } else {
        setError('Something went wrong');
      }
    } else if (res.status === 400) {
      setPending(false);
      const data = await res.json();
      setError(data.message);
      toast.error(data.message);
    } else if (res.status === 500) {
      setPending(false);
      const data = await res.json();
      setError(data.message);
      toast.error(data.message);
    }
  };

  const handleProvider = (provider: 'github' | 'google') => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <Card className="flex flex-col justify-center items-center mx-auto p-8 shadow-black/20 shadow-lg">
      <div className="flex flex-col items-center">
        <CardHeader>
          <CardTitle className="text-center">Регистрация</CardTitle>
          <CardDescription className="text-sm text-center text-accent-foreground max-w-[200px]">
            Используйте свой почту или сервис для регистрации
          </CardDescription>
        </CardHeader>
        {!!error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-center text-destructive gap-x-2 text-sm mb-6">
            <TriangleAlert />
            <p>{error}</p>
          </div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-1 max-w-md w-80">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="min-h-[76px] flex items-center flex-col">
                  <FormControl>
                    <Input placeholder="Имя(никнейм)" disabled={pending} {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage className=" text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="min-h-[76px] flex items-center flex-col">
                  <FormControl>
                    <Input placeholder="Почта" disabled={pending} {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage className=" text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="min-h-[76px] flex items-center flex-col">
                  <FormControl>
                    <Input placeholder="Пароль" type="password" disabled={pending} {...field} />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="passwordConfirm"
              render={({ field }) => (
                <FormItem className="min-h-[76px] flex items-center flex-col">
                  <FormControl>
                    <Input
                      placeholder="Подтверждение пароля"
                      type="password"
                      disabled={pending}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage className="text-sm" />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={pending} className="w-full rounded-md ">
              Зарегестрироваться
            </Button>
          </form>
          <div className="flex mt-4 gap-x-4 justify-evenly mx-auto items-center">
            <Button
              onClick={() => handleProvider('google')}
              variant="outline"
              size="lg"
              disabled={pending}
              className="bg-slate-300 hover:bg-slate-400 hover:scale-105"
            >
              <FaGoogle className="size-8 left-2.5 top-2.5" />
            </Button>
            <Button
              onClick={() => handleProvider('github')}
              variant="outline"
              size="lg"
              disabled={pending}
              className="bg-slate-300 hover:bg-slate-400 hover:scale-105"
            >
              <FaGithub className="size-8 left-2.5 top-2.5" />
            </Button>
          </div>
          <p className="text-center text-sm mt-3 text-muted-foreground">Уже есть аккаунт?</p>
          <Link className="text-sky-700 text-sm ml-1 hover:underline cursor-pointer" href="sign-in">
            Войти
          </Link>
        </Form>
      </div>
    </Card>
  );
};
