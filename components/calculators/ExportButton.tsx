'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ExcelExportInputs } from '@/lib/excel/types';
import type { Language } from '@/lib/translations';

interface ExportButtonProps {
  inputs: ExcelExportInputs;
  translations: {
    exportToExcel: string;
    downloading: string;
    downloadComplete: string;
  };
  language: Language;
}

export function ExportButton({ inputs, translations: t, language }: ExportButtonProps) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleExport = async () => {
    setStatus('loading');

    try {
      // Dynamic import to reduce initial bundle size
      const { RealEstateExcelBuilder } = await import('@/lib/excel');

      const builder = new RealEstateExcelBuilder({
        language,
        inputs,
        currencySymbol: language === 'he' ? '₪' : '$',
      });

      builder.build();
      builder.download();

      setStatus('done');
      setTimeout(() => setStatus('idle'), 2000);
    } catch (error) {
      console.error('Export failed:', error);
      setStatus('idle');
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={status === 'loading'}
      className="gap-2 bg-white/50 dark:bg-zinc-800/50 backdrop-blur-sm border-zinc-300/50 dark:border-zinc-600/50 hover:bg-white/80 dark:hover:bg-zinc-700/80"
    >
      {status === 'loading' ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="hidden sm:inline">{t.downloading}</span>
        </>
      ) : status === 'done' ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span className="hidden sm:inline">{t.downloadComplete}</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="h-4 w-4" />
          <span className="hidden sm:inline">{t.exportToExcel}</span>
        </>
      )}
    </Button>
  );
}
