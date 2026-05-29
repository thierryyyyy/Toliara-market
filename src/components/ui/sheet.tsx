import React, { useState, useContext, createContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

type SheetSide = 'left' | 'right' | 'top' | 'bottom';

interface SheetProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

const SheetContext = React.createContext<{ open: boolean; onOpenChange: (open: boolean) => void; side: SheetSide } | null>(null);

function Sheet({ open = false, onOpenChange, children }: SheetProps) {
  const [internalOpen, setInternalOpen] = React.useState(open);
  const isOpen = onOpenChange ? open : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  return <SheetContext.Provider value={{ open: isOpen, onOpenChange: setOpen, side: 'right' }}>{children}</SheetContext.Provider>;
}

function SheetTrigger({ children, asChild }: { children: ReactNode; asChild?: boolean }) {
  const context = React.useContext(SheetContext);
  if (!context) return null;
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<{ onClick?: () => void }>, {
      onClick: () => context.onOpenChange(true)
    });
  }
  return <button onClick={() => context.onOpenChange(true)}>{children}</button>;
}

const sideStyles: Record<SheetSide, string> = {
  right: 'right-0 top-0 h-full w-3/4 max-w-sm animate-in slide-in-from-right',
  left: 'left-0 top-0 h-full w-3/4 max-w-sm animate-in slide-in-from-left',
  top: 'top-0 left-0 w-full h-auto max-h-[80vh] animate-in slide-in-from-top',
  bottom: 'bottom-0 left-0 w-full h-auto max-h-[80vh] animate-in slide-in-from-bottom'
};

function SheetContent({ children, className, side = 'right' }: { children: ReactNode; className?: string; side?: SheetSide }) {
  const context = React.useContext(SheetContext);
  if (!context?.open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/50" onClick={() => context.onOpenChange(false)} />
      <div className={cn('fixed bg-background p-6 shadow-lg', sideStyles[side], className)}>
        <button className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100" onClick={() => context.onOpenChange(false)}>
          <X className="h-4 w-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

function SheetHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col space-y-2 mb-4', className)} {...props} />;
}

function SheetTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold', className)} {...props} />;
}

function SheetDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-muted-foreground', className)} {...props} />;
}

function SheetFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4', className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter };
