import PublicStreamVideoProvider from '@/providers/public-stream-client-provider';
import React from 'react';
interface RootLayoutProps {
  children: React.ReactNode
}
const AnonymousLayout = ({ children }: RootLayoutProps) => {
  return (
    <main>
      <PublicStreamVideoProvider>
        {children}
      </PublicStreamVideoProvider>
    </main>
  )
}

export default AnonymousLayout
