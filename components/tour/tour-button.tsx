"use client"

import { Button } from '@/components/ui/button'
import { HelpCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TourButtonProps {
  onStart: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showLabel?: boolean
}

export function TourButton({ 
  onStart, 
  variant = 'outline',
  size = 'sm',
  className,
  showLabel = true
}: TourButtonProps) {
  return (
    <Button
      data-tour="header-tour-button"
      onClick={onStart}
      variant={variant}
      size={size}
      className={cn(
        "gap-2 border-primary-300 text-primary-600 hover:bg-primary-50",
        className
      )}
      aria-label="Iniciar tour guiado"
    >
      <HelpCircle className="w-4 h-4" />
      {showLabel && <span className="hidden sm:inline">Tour Guiado</span>}
    </Button>
  )
}

