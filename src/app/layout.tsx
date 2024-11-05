import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '@/utils/sessionProvider';
import { AppSidebar } from '@/components/sideBar/Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import { CustomTrigger } from '@/components/sideBar/CustomTrigger';
import { ThemeProvider } from '@/components/theme-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <SidebarProvider defaultOpen={defaultOpen}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {/* <div className="grid grid-cols-1 grid-cols-[auto_1fr] grid-cols-1 w-full"> */}
              <div className="grid grid-cols-1 w-full sm:grid-cols-[auto_1fr]">
                <AppSidebar></AppSidebar>
                <main className="flex flex-col min-h-screen">
                  <CustomTrigger />
                  {/* <SidebarTrigger /> */}
                  {children}
                </main>
              </div>
            </ThemeProvider>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
