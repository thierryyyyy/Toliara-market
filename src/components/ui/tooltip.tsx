import React, { useState, useContext, createContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const TooltipContext = React.createContext<{ open: boolean; setOpen: (open: boolean) => void } | null>(null);

function TooltipProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function Tooltip({ children }: { children: ReactNode }) {
  const [open, setOpen] = React.useState(false);
  return <TooltipContext.Provider value={{ open, setOpen }}>{children}</TooltipContext.Provider>;
}

function TooltipTrigger({ children, asChild }: { children: ReactNode; asChild?: boolean }) {
  const context = React.useContext(TooltipContext);
  if (!context) return null;
  
  const props = {
    onMouseEnter: () => context.setOpen(true),
    onMouseLeave: () => context.setOpen(false),
    onFocus: () => context.setOpen(true),
    onBlur: () => context.setOpen(false)
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, props);
  }
  return <span {...props}>{children}</span>;
}

function TooltipContent({ children, className, side = 'top' }: { children: ReactNode; className?: string; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  const context = React.useContext(TooltipContext);
  if (!context?.open) return null;

  const sideStyles = {
    top: '-translate-x-1/2 -translate-y-full -top-2 left-1/2',
    bottom: '-translate-x-1/2 translate-y-full -bottom-2 left-1/2',
    left: '-translate-x-full -translate-y-1/2 -left-2 top-1/2',
    right: 'translate-x-full -translate-y-1/2 -right-2 top-1/2'
  };

  return (
    <div className={cn(
      'absolute z-50 px-3 py-1.5 text-sm bg-popover text-popover-foreground rounded-md shadow-md border animate-in fade-in-0 zoom-in-95',
      sideStyles[side],
      className
    )}>
      {children}
    </div>
  );
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
