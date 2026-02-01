/**
 * SavePropertyDialog - Dialog for saving a property calculation
 *
 * Features:
 * - Name input for the property
 * - Displays key metrics of what's being saved
 * - Auto-generates default names based on purchase price
 * - Validates input before saving
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save } from 'lucide-react';
import { useSavedPropertiesStore } from '@/lib/stores/savedPropertiesStore';
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';
import { calculateDerivedValues } from '../utils/calculations';
import type { RealEstateInputs } from '../types';

interface SavePropertyDialogProps {
  inputs: RealEstateInputs;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

/**
 * Generate a default property name based on purchase price and timestamp
 */
const generateDefaultName = (purchasePrice: number): string => {
  const priceK = Math.round(purchasePrice / 1000);
  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return `Property $${priceK}K - ${timestamp}`;
};

export function SavePropertyDialog({
  inputs,
  open,
  onOpenChange,
  trigger,
}: SavePropertyDialogProps) {
  const { formatCurrencySafe } = useCurrencyFormatter();
  const { saveProperty } = useSavedPropertiesStore();

  const [propertyName, setPropertyName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Reset and generate default name when dialog opens
  useEffect(() => {
    if (open) {
      setPropertyName(generateDefaultName(inputs.purchasePrice));
    }
  }, [open, inputs.purchasePrice]);

  const handleSave = () => {
    if (!propertyName.trim()) return;

    setIsSaving(true);
    try {
      saveProperty(propertyName.trim(), inputs);
      onOpenChange(false);
      setPropertyName('');
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && propertyName.trim()) {
      handleSave();
    }
  };

  const derived = calculateDerivedValues(inputs);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Property</DialogTitle>
          <DialogDescription>
            Save this property calculation to access it later from your saved properties.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="property-name">Property Name</Label>
            <Input
              id="property-name"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="e.g., Downtown Condo, Beach House"
              autoFocus
            />
          </div>

          {/* Property Summary */}
          <div className="rounded-lg border p-4 space-y-2 bg-muted/50">
            <h4 className="text-sm font-semibold mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Purchase Price</p>
                <p className="font-semibold">{formatCurrencySafe(inputs.purchasePrice)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Monthly Rent</p>
                <p className="font-semibold">{formatCurrencySafe(inputs.monthlyRent)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Down Payment</p>
                <p className="font-semibold">{formatCurrencySafe(derived.downPayment)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Cash Required</p>
                <p className="font-semibold">{formatCurrencySafe(derived.totalCashRequired)}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!propertyName.trim() || isSaving}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Property'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
