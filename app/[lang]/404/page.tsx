"use client";

import { useEffect, useState, use } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useTranslationStore, Language } from '@/lib/translations';
import { commonTranslations } from '@/lib/translations/common';
import { TransparentImage } from '@/components/ui/transparent-image';

export default function NotFoundPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = use(params);
  const lang = langParam as Language;
  const { direction } = useTranslationStore();
  const t = commonTranslations[lang];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log("404 page mounted with params:", lang);
  }, [lang]);

  if (!mounted) {
    // Return a simple loading state instead of null
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-[988px] mx-auto flex-1 w-full flex flex-col lg:flex-row items-center justify-center min-h-[70vh] p-4 gap-8" dir={direction()}>
      <TransparentImage 
        src="/images/lost-puppy.png" 
        alt="Lost puppy"
        width={640}
        height={358}
        className="mb-8 lg:mb-0"
      />

      <div className="max-w-md flex flex-col items-center lg:items-start">
        <h1 className="text-4xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300">
          404
        </h1>
        
        <h2 className="text-2xl lg:text-3xl font-semibold mb-4">
          {t.oopsGotLost}
        </h2>
        
        <p className="text-muted-foreground mb-8 text-center lg:text-left">
          {t.pageNotFoundDesc}
        </p>
        
        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <Button variant="outline" onClick={() => window.history.back()}>
            {t.goBack}
          </Button>
          <Button asChild>
            <Link href={`/${lang}`}>
              {t.goHome}
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 