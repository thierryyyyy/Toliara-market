'use client';
import React, { useState, useEffect, useCallback, type ReactNode } from 'react';
import { Dialog, DialogContent, DialogTrigger } from './dialog';
import { Button } from './button';
import { ChevronLeft, ChevronRight, X, Plus, Minus, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

// ============================================================================
// LIGHTBOX - Composant pour afficher des images en plein écran
// ============================================================================

export interface LightboxImage {
  src: string;
  alt?: string;
  caption?: string;
  thumbnail?: string; // Image miniature pour la galerie
}

export interface LightboxProps {
  /** Images à afficher */
  images: LightboxImage[];
  /** Index initial (défaut: 0) */
  initialIndex?: number;
  /** Élément déclencheur */
  children: ReactNode;
  /** Callback lors du changement d'image */
  onIndexChange?: (index: number) => void;
  /** Afficher les contrôles de zoom */
  showZoom?: boolean;
  /** Afficher le bouton de téléchargement */
  showDownload?: boolean;
  /** Classes CSS additionnelles */
  className?: string;
}

export function Lightbox({
  images,
  initialIndex = 0,
  children,
  onIndexChange,
  showZoom = true,
  showDownload = false,
  className
}: LightboxProps) {
  const [open, setOpen] = React.useState(false);
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex);
  const [zoom, setZoom] = React.useState(1);

  // Navigation
  const goNext = React.useCallback(() => {
    const newIndex = (currentIndex + 1) % images.length;
    setCurrentIndex(newIndex);
    setZoom(1);
    onIndexChange?.(newIndex);
  }, [currentIndex, images.length, onIndexChange]);

  const goPrev = React.useCallback(() => {
    const newIndex = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(newIndex);
    setZoom(1);
    onIndexChange?.(newIndex);
  }, [currentIndex, images.length, onIndexChange]);

  const goToIndex = React.useCallback((index: number) => {
    setCurrentIndex(index);
    setZoom(1);
    onIndexChange?.(index);
  }, [onIndexChange]);

  // Zoom
  const zoomIn = () => setZoom(z => Math.min(z + 0.5, 3));
  const zoomOut = () => setZoom(z => Math.max(z - 0.5, 0.5));

  // Téléchargement
  const handleDownload = () => {
    const current = images[currentIndex];
    const link = document.createElement('a');
    link.href = current.src;
    link.download = current.alt || `image-${currentIndex + 1}`;
    link.click();
  };

  // Keyboard navigation
  const handleKeyDown = React.useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
        goNext();
        break;
      case 'ArrowLeft':
        goPrev();
        break;
      case 'Escape':
        setOpen(false);
        break;
      case '+':
      case '=':
        zoomIn();
        break;
      case '-':
        zoomOut();
        break;
    }
  }, [goNext, goPrev]);

  React.useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  // Reset au changement d'état open
  React.useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex);
      setZoom(1);
    }
  }, [open, initialIndex]);

  const current = images[currentIndex];

  if (!images.length) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className={className}>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-none overflow-hidden">
        <div className="relative flex flex-col h-[95vh]">
          {/* Toolbar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
            {/* Counter */}
            {images.length > 1 && (
              <span className="text-white/80 text-sm font-medium">
                {currentIndex + 1} / {images.length}
              </span>
            )}
            
            {/* Controls */}
            <div className="flex items-center gap-2 ml-auto">
              {showZoom && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={zoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <Minus className="h-5 w-5" />
                  </Button>
                  <span className="text-white/60 text-sm min-w-[3rem] text-center">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={zoomIn}
                    disabled={zoom >= 3}
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </>
              )}
              
              {showDownload && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-white hover:bg-white/20"
                  onClick={handleDownload}
                >
                  <Download className="h-5 w-5" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20"
                onClick={() => setOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
          </div>

          {/* Main image area */}
          <div className="flex-1 flex items-center justify-center relative overflow-hidden">
            {/* Navigation arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 z-40 text-white hover:bg-white/20 h-12 w-12"
                  onClick={goPrev}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 z-40 text-white hover:bg-white/20 h-12 w-12"
                  onClick={goNext}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>
              </>
            )}

            {/* Image */}
            <img
              src={current.src}
              alt={current.alt || ''}
              className={cn(
                "max-w-full max-h-[70vh] object-contain transition-transform duration-200",
                zoom !== 1 && "cursor-move"
              )}
              style={{ transform: `scale(${zoom})` }}
              draggable={false}
            />
          </div>

          {/* Caption */}
          {current.caption && (
            <div className="absolute bottom-20 left-0 right-0 text-center">
              <p className="text-white text-lg px-4 py-2 bg-black/40 inline-block rounded-xl">
                {current.caption}
              </p>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex justify-center gap-2 overflow-x-auto py-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => goToIndex(idx)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                      idx === currentIndex
                        ? "border-white opacity-100"
                        : "border-transparent opacity-60 hover:opacity-100"
                    )}
                  >
                    <img
                      src={img.thumbnail || img.src}
                      alt={img.alt || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// LIGHTBOX TRIGGER - Pour déclencher le lightbox sur une image
// ============================================================================

export interface LightboxTriggerProps {
  src: string;
  alt?: string;
  className?: string;
  children?: ReactNode;
}

export function LightboxTrigger({ src, alt, className, children }: LightboxTriggerProps) {
  return (
    <Lightbox images={[{ src, alt }]}>
      {children || (
        <img
          src={src}
          alt={alt || ''}
          className={cn("cursor-pointer hover:opacity-90 transition-opacity", className)}
        />
      )}
    </Lightbox>
  );
}

// ============================================================================
// IMAGE GALLERY - Galerie d'images avec lightbox intégré
// ============================================================================

export interface ImageGalleryProps {
  images: LightboxImage[];
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  aspectRatio?: 'square' | 'video' | 'auto';
  className?: string;
}

export function ImageGallery({
  images,
  columns = 3,
  gap = 'md',
  aspectRatio = 'square',
  className
}: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const colClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };

  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: ''
  };

  return (
    <div className={cn('grid', colClasses[columns], gapClasses[gap], className)}>
      {images.map((img, idx) => (
        <Lightbox
          key={idx}
          images={images}
          initialIndex={idx}
          onIndexChange={setSelectedIndex}
        >
          <div
            className={cn(
              "overflow-hidden rounded-xl cursor-pointer group",
              aspectClasses[aspectRatio]
            )}
          >
            <img
              src={img.thumbnail || img.src}
              alt={img.alt || `Image ${idx + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Lightbox>
      ))}
    </div>
  );
}

export default Lightbox;
