/**
 * Real Estate Calculator V2 - Share Button Component
 * 
 * Button to copy shareable URL to clipboard.
 */

'use client';

import React, { useState } from 'react';
import { Check, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RealEstateInputs } from '../types';

interface ShareButtonProps {
  inputs: RealEstateInputs;
  copyShareUrl: (inputs: RealEstateInputs) => Promise<boolean>;
  translations: any;
}

export function ShareButton({ inputs, copyShareUrl, translations: t }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  
  const handleShare = async () => {
    const success = await copyShareUrl(inputs);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="gap-2"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          <span>{t.linkCopied}</span>
        </>
      ) : (
        <>
          <Link className="h-4 w-4" />
          <span>{t.shareCalculation}</span>
        </>
      )}
    </Button>
  );
}

