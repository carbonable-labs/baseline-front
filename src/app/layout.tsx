// src/app/layout.tsx

import './globals.css';
import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className='bg-neutral-800 text-neutral-100'>
        {children}
      </body>
    </html>
  );
}
