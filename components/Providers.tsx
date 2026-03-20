'use client';

import { ThemeProvider } from 'next-themes';

// mounted 가드 없이 항상 ThemeProvider 렌더 → dark class가 html에 즉시 주입됨
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}
