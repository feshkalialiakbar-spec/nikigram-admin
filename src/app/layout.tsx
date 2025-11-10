"use client"
import '../styles/main.scss';
import '../styles/modal-animations.css';
import { ToastProvider } from '@/components/ui';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <ToastProvider>
          <div className="mainStyles">
            {children}
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
