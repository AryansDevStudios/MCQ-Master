'use client';

import type { Metadata } from 'next';
import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import { cn } from '@/lib/utils';
import { QuizProvider, useQuiz } from '@/context/QuizProvider';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/layout/ToastContainer';

const fontBody = Inter({
  subsets: ['latin'],
  variable: '--font-body',
});

const fontHeadline = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
});

/*
export const metadata: Metadata = {
  title: 'MCQ Master',
  description: 'A premium AI-powered practice platform for quizzes with Markdown and LaTeX support.',
};
*/

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QuizProvider>
      <LayoutContent>{children}</LayoutContent>
    </QuizProvider>
  );
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { theme } = useQuiz();
  return (
    <html lang="en" className={theme}>
      <head>
        <title>MCQ Master</title>
        <meta name="description" content="A premium AI-powered practice platform for quizzes with Markdown and LaTeX support." />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css"
          integrity="sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvMSheGMkindg"
          crossOrigin="anonymous"
        />
      </head>
      <body className={cn('min-h-screen bg-background font-body antialiased', fontBody.variable, fontHeadline.variable)}>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-8">
              {children}
            </main>
            <Footer />
          </div>
          <ToastContainer />
      </body>
    </html>
  );
}
