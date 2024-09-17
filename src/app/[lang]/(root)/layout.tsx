import StreamVideoProvider from '@/providers/stream-client-provider';
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import React from 'react';
interface RootLayoutProps {
  children: React.ReactNode
}
const RootLayout = ({ children }: RootLayoutProps) => {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get("session");

  if (!sessionCookie) {
    redirect("/login");
  }
  return (
    <main>
      <StreamVideoProvider>
        {children}
      </StreamVideoProvider>
    </main>
  )
}

export default RootLayout
