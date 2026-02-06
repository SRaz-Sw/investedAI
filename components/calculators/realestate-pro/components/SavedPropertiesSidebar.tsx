/**
 * SavedPropertiesSidebar - Displays and manages saved real estate properties
 *
 * Features:
 * - List all saved properties
 * - Load property into calculator
 * - Duplicate, rename, and delete properties
 * - Display key metrics for each property
 * - Empty state when no properties saved
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  FolderOpen,
  Trash2,
  Copy,
  Edit2,
  Play,
  Archive,
  Home,
  Download,
  Upload,
  X,
  ChevronLeft,
  ChevronRight,
  Settings,
  RotateCcw,
} from 'lucide-react';
import { useSavedPropertiesStore } from '@/lib/stores/savedPropertiesStore';
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';
import { calculateDerivedValues } from '../utils/calculations';
import type { RealEstateInputs, SliderConfigs } from '../types';

interface SavedPropertiesSidebarProps {
  onLoadProperty: (inputs: RealEstateInputs) => void;
  currentInputs: RealEstateInputs;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
  mode?: 'fixed' | 'overlay';
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
  sliderConfigs?: SliderConfigs;
}

export function SavedPropertiesSidebar({
  onLoadProperty,
  currentInputs,
  open,
  onOpenChange,
  trigger,
  mode = 'overlay',
  onToggleCollapse,
  isCollapsed = false,
  sliderConfigs,
}: SavedPropertiesSidebarProps) {
  const { formatCurrencySafe } = useCurrencyFormatter();
  const {
    properties,
    deleteProperty,
    duplicateProperty,
    renameProperty,
    exportToJSON,
    importFromJSON,
    sliderRanges,
    clearSliderRange,
    clearAllSliderRanges,
  } = useSavedPropertiesStore();

  // Local state for dialogs
  const [prefsDialogOpen, setPrefsDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [importExportMessage, setImportExportMessage] = useState('');

  // Handlers
  const handleLoad = (inputs: RealEstateInputs) => {
    onLoadProperty(inputs);
    onOpenChange(false);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedPropertyId(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedPropertyId) {
      deleteProperty(selectedPropertyId);
      setDeleteDialogOpen(false);
      setSelectedPropertyId(null);
    }
  };

  const handleRenameClick = (id: string, currentName: string) => {
    setSelectedPropertyId(id);
    setRenameValue(currentName);
    setRenameDialogOpen(true);
  };

  const handleRenameConfirm = () => {
    if (selectedPropertyId && renameValue.trim()) {
      renameProperty(selectedPropertyId, renameValue.trim());
      setRenameDialogOpen(false);
      setSelectedPropertyId(null);
      setRenameValue('');
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateProperty(id);
  };

  const handleExport = () => {
    try {
      exportToJSON();
      setImportExportMessage('Export successful! File downloaded.');
      setTimeout(() => setImportExportMessage(''), 3000);
    } catch (error) {
      setImportExportMessage('Export failed. Please try again.');
      setTimeout(() => setImportExportMessage(''), 3000);
    }
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const result = await importFromJSON(file);
        setImportExportMessage(result.message);
        setTimeout(() => setImportExportMessage(''), 4000);
      }
    };
    input.click();
  };

  // Sort properties by most recently updated
  const sortedProperties = [...properties].sort(
    (a, b) => b.updatedAt - a.updatedAt
  );

  // Shared content component
  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Saved Properties</h3>
          </div>
          {mode === 'fixed' && onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="h-8 w-8 p-0"
              title="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {properties.length === 0
            ? 'No saved properties yet'
            : `${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`}
        </p>
      </div>

      {/* Export/Import Buttons */}
      <div className="flex gap-2 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={properties.length === 0}
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleImport}
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import JSON
            </Button>
          </div>

          {/* Import/Export Message */}
          {importExportMessage && (
            <div className="mt-2 p-2 text-sm rounded-md bg-primary/10 text-primary">
              {importExportMessage}
            </div>
          )}

          <Separator className="my-4" />

          {/* Preferences Section */}
          {sliderConfigs && (
            <>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <h4 className="text-sm font-medium">Slider Ranges</h4>
                </div>
                {Object.keys(sliderRanges).length > 0 && (
                  <Badge variant="secondary" className="text-[10px]">
                    {Object.keys(sliderRanges).length} customized
                  </Badge>
                )}
              </div>
              {Object.keys(sliderRanges).length === 0 ? (
                <p className="text-xs text-muted-foreground mb-2">All ranges at defaults. Click min/max labels on any slider to customize.</p>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mb-2"
                  onClick={() => setPrefsDialogOpen(true)}
                >
                  View &amp; Manage
                </Button>
              )}
              <Separator className="my-4" />
            </>
          )}

          {/* Empty State */}
          {properties.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Saved Properties</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Start saving your real estate calculations to easily access them later.
                Click the save button in the calculator to get started.
              </p>
            </div>
          )}

      {/* Properties List */}
      {properties.length > 0 && (
        <ScrollArea className={mode === 'fixed' ? 'h-[calc(100vh-280px)] pr-4' : 'h-[calc(100vh-200px)] pr-4'}>
          <div className="space-y-4">
            {sortedProperties.map((property) => {
              const derived = calculateDerivedValues(property.inputs);
              const isCurrentProperty = JSON.stringify(property.inputs) === JSON.stringify(currentInputs);

              return (
                <div
                  key={property.id}
                  className={`rounded-lg border p-4 transition-colors hover:bg-accent/50 ${
                    isCurrentProperty ? 'border-primary bg-accent/30' : ''
                  }`}
                >
                  {/* Property Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Home className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <h4 className="font-semibold text-sm truncate">
                          {property.name}
                        </h4>
                      </div>
                      {isCurrentProperty && (
                        <Badge variant="outline" className="text-xs">
                          Currently Loaded
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
                    <div>
                      <p className="text-muted-foreground">Purchase Price</p>
                      <p className="font-semibold">
                        {formatCurrencySafe(property.inputs.purchasePrice)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Monthly Rent</p>
                      <p className="font-semibold">
                        {formatCurrencySafe(property.inputs.monthlyRent)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Down Payment</p>
                      <p className="font-semibold">
                        {formatCurrencySafe(derived.downPayment)}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cash Required</p>
                      <p className="font-semibold">
                        {formatCurrencySafe(derived.totalCashRequired)}
                      </p>
                    </div>
                  </div>

                  {/* Updated Date */}
                  <p className="text-xs text-muted-foreground mb-3">
                    Updated {new Date(property.updatedAt).toLocaleDateString()}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleLoad(property.inputs)}
                      className="flex-1"
                    >
                      <Play className="h-3 w-3 mr-1" />
                      Load
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDuplicate(property.id)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRenameClick(property.id, property.name)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteClick(property.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </>
  );

  // Render based on mode
  return (
    <>
      {/* Fixed Sidebar (Desktop) */}
      {mode === 'fixed' && open && (
        <div className={`fixed left-0 top-0 h-screen bg-background border-r border-border z-40 transition-all duration-300 ${isCollapsed ? 'w-0' : 'w-80'} overflow-hidden`}>
          <div className="p-6 h-full flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Overlay Sidebar (Mobile/Sheet) */}
      {mode === 'overlay' && (
        <Sheet open={open} onOpenChange={onOpenChange}>
          {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
          <SheetContent side="left" className="w-full sm:max-w-md">
            <SheetHeader className="space-y-2 mb-4">
              <SheetTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Saved Properties
              </SheetTitle>
              <SheetDescription>
                {properties.length === 0
                  ? 'No saved properties yet'
                  : `${properties.length} saved ${properties.length === 1 ? 'property' : 'properties'}`}
              </SheetDescription>
            </SheetHeader>
            <SidebarContent />
          </SheetContent>
        </Sheet>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Property?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              saved property calculation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <AlertDialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Property</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this property
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            placeholder="Property name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameConfirm();
              }
            }}
            autoFocus
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setRenameValue('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRenameConfirm}
              disabled={!renameValue.trim()}
            >
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Slider Range Preferences Dialog */}
      <AlertDialog open={prefsDialogOpen} onOpenChange={setPrefsDialogOpen}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Customized Slider Ranges
            </AlertDialogTitle>
            <AlertDialogDescription>
              These slider ranges have been customized from their defaults.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto py-2">
            {Object.entries(sliderRanges).map(([key, override]) => {
              const config = sliderConfigs?.[key as keyof RealEstateInputs];
              const label = config?.label || key;
              const prefix = config?.prefix || '';
              const suffix = config?.suffix || '';
              const fmt = (v: number) => prefix + v.toLocaleString() + suffix;
              return (
                <div key={key} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{label}</p>
                    <p className="text-xs text-muted-foreground">
                      {override.min !== undefined && `Min: ${fmt(override.min)}`}
                      {override.min !== undefined && override.max !== undefined && '  ·  '}
                      {override.max !== undefined && `Max: ${fmt(override.max)}`}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 flex-shrink-0"
                    title="Reset to default"
                    onClick={() => clearSliderRange(key)}
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
          <AlertDialogFooter className="flex-row gap-2 sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearAllSliderRanges();
                setPrefsDialogOpen(false);
              }}
            >
              Reset All to Defaults
            </Button>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
