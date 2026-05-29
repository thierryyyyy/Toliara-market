import React, { useState, useEffect, useCallback, useContext, createContext, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

interface CarouselProps {
  children: ReactNode;
  className?: string;
  autoPlay?: boolean;
  interval?: number;
}

const CarouselContext = React.createContext<{
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  itemsCount: number;
  next: () => void;
  previous: () => void;
} | null>(null);

function Carousel({ children, className, autoPlay = false, interval = 5000 }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [itemsCount, setItemsCount] = React.useState(0);

  const next = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % itemsCount);
  }, [itemsCount]);

  const previous = React.useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + itemsCount) % itemsCount);
  }, [itemsCount]);

  React.useEffect(() => {
    if (autoPlay && itemsCount > 1) {
      const timer = setInterval(next, interval);
      return () => clearInterval(timer);
    }
  }, [autoPlay, interval, next, itemsCount]);

  return (
    <CarouselContext.Provider value={{ currentIndex, setCurrentIndex, itemsCount, next, previous }}>
      <div className={cn('relative', className)}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child) && child.type === CarouselContent) {
            return React.cloneElement(child as React.ReactElement<any>, { setItemsCount });
          }
          return child;
        })}
      </div>
    </CarouselContext.Provider>
  );
}

function CarouselContent({ children, className, setItemsCount }: { children: ReactNode; className?: string; setItemsCount?: (count: number) => void }) {
  const context = React.useContext(CarouselContext);
  const items = React.Children.toArray(children);
  
  React.useEffect(() => {
    setItemsCount?.(items.length);
  }, [items.length, setItemsCount]);

  if (!context) return null;

  return (
    <div className={cn('overflow-hidden', className)}>
      <div
        className="flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${context.currentIndex * 100}%)` }}
      >
        {items.map((child, index) => (
          <div key={index} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}

function CarouselItem({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn('', className)}>{children}</div>;
}

function CarouselPrevious({ className }: { className?: string }) {
  const context = React.useContext(CarouselContext);
  if (!context) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn('absolute left-2 top-1/2 -translate-y-1/2 rounded-full', className)}
      onClick={context.previous}
    >
      <ChevronLeft className="h-4 w-4" />
    </Button>
  );
}

function CarouselNext({ className }: { className?: string }) {
  const context = React.useContext(CarouselContext);
  if (!context) return null;

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn('absolute right-2 top-1/2 -translate-y-1/2 rounded-full', className)}
      onClick={context.next}
    >
      <ChevronRight className="h-4 w-4" />
    </Button>
  );
}

function CarouselDots({ className }: { className?: string }) {
  const context = React.useContext(CarouselContext);
  if (!context) return null;

  return (
    <div className={cn('flex justify-center gap-2 mt-4', className)}>
      {Array.from({ length: context.itemsCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => context.setCurrentIndex(index)}
          className={cn(
            'w-2 h-2 rounded-full transition-all',
            context.currentIndex === index ? 'bg-primary w-4' : 'bg-muted-foreground/30'
          )}
        />
      ))}
    </div>
  );
}

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots };
