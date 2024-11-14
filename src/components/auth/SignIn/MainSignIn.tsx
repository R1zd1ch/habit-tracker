'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SignInSchema } from '@/schema/SignInShema';
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

export const SignIn = () => {
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    if (session) {
      // router.push('/');
    }
  }, [session, router]);
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    mode: 'all',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    setPending(true);
    const res = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
    });
    if (res?.ok) {
      router.push('/');
      toast.success('Login successful');
    } else if (res?.status === 401) {
      setError('Invalid Credentials');
    } else {
      setError('Something went wrong');
    }
    setPending(false);
  };

  const handleProvider = (provider: 'github' | 'google') => {
    signIn(provider, { callbackUrl: '/' });
  };

  return (
    <Card className="flex flex-col justify-center items-center mx-auto p-8 shadow-black/20 shadow-lg">
      <div className="flex flex-col items-center">
        <CardHeader>
          <CardTitle className="text-center">Вход</CardTitle>
          <CardDescription className="text-sm text-center text-accent-foreground max-w-[200px]">
            Используйте свой почту или альтернативный сервис
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
            <Button type="submit" disabled={pending} className="w-full rounded-md  ">
              Войти
            </Button>
          </form>
          <div className="flex mt-4 gap-x-4 justify-evenly mx-auto items-center">
            <Button
              onClick={() => handleProvider('google')}
              variant="outline"
              size="lg"
              disabled={pending}
              className="hover:scale-105"
            >
              <FaGoogle className="size-8 left-2.5 top-2.5" />
            </Button>
            <Button
              onClick={() => handleProvider('github')}
              variant="outline"
              size="lg"
              disabled={pending}
              className=" hover:scale-105"
            >
              <FaGithub className="size-8 left-2.5 top-2.5" />
            </Button>
          </div>
          <p className="text-center text-sm mt-3 text-muted-foreground">Создать новый аккаунт</p>
          <Link
            className="hover:text-sky-700 text-sm ml-1 hover:underline cursor-pointer"
            href="sign-up"
          >
            Зарегистрироваться
          </Link>
        </Form>
      </div>
    </Card>
  );
};
