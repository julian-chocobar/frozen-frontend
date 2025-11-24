"use client"

import { useEffect, useState } from 'react'
import { useTour } from '@/contexts/tour-context'
import { useAuth } from '@/contexts/auth-context'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { HelpCircle } from 'lucide-react'

const TOUR_COMPLETED_KEY = 'tour_completed'
const TOUR_DISMISSED_KEY = 'tour_dismissed'
const TOUR_DISMISSED_DATE_KEY = 'tour_dismissed_date'

// Días antes de volver a sugerir el tour después de haberlo descartado
const DAYS_BEFORE_RE_SUGGEST = 7

export function TourNotification() {
  const { user, isAuthenticated } = useAuth()
  const { startFullTour, isRunning } = useTour()
  const [showDialog, setShowDialog] = useState(false)
  const [wasRunning, setWasRunning] = useState(false)

  // Marcar el tour como completado cuando termine
  useEffect(() => {
    if (wasRunning && !isRunning && user) {
      // El tour terminó, marcar como completado
      localStorage.setItem(`${TOUR_COMPLETED_KEY}_${user.id}`, 'true')
      setWasRunning(false)
    }
    if (isRunning) {
      setWasRunning(true)
    }
  }, [isRunning, wasRunning, user])

  useEffect(() => {
    if (!isAuthenticated || !user) return

    // Verificar si el usuario ya completó el tour
    const tourCompleted = localStorage.getItem(`${TOUR_COMPLETED_KEY}_${user.id}`)
    if (tourCompleted === 'true') {
      return
    }

    // Verificar si el usuario descartó el tour recientemente
    const dismissedDate = localStorage.getItem(`${TOUR_DISMISSED_DATE_KEY}_${user.id}`)
    if (dismissedDate) {
      const dismissed = new Date(dismissedDate)
      const now = new Date()
      const daysDiff = Math.floor((now.getTime() - dismissed.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff < DAYS_BEFORE_RE_SUGGEST) {
        return
      }
    }

    // Verificar si el usuario descartó el tour permanentemente
    const tourDismissed = localStorage.getItem(`${TOUR_DISMISSED_KEY}_${user.id}`)
    if (tourDismissed === 'permanent') {
      return
    }

    // Mostrar el diálogo después de un pequeño delay para mejor UX
    const timer = setTimeout(() => {
      setShowDialog(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [isAuthenticated, user])

  const handleStartTour = () => {
    if (user) {
      localStorage.setItem(`${TOUR_COMPLETED_KEY}_${user.id}`, 'false')
    }
    setShowDialog(false)
    startFullTour()
  }

  const handleDismiss = (permanent: boolean = false) => {
    if (user) {
      if (permanent) {
        localStorage.setItem(`${TOUR_DISMISSED_KEY}_${user.id}`, 'permanent')
      } else {
        localStorage.setItem(`${TOUR_DISMISSED_DATE_KEY}_${user.id}`, new Date().toISOString())
      }
    }
    setShowDialog(false)
  }

  if (!showDialog) return null

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-primary-600" />
            </div>
            <AlertDialogTitle>¿Te gustaría hacer un tour guiado?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            Te mostraremos las principales funcionalidades del sistema para que puedas aprovecharlo al máximo.
            <br />
            <br />
            El tour es opcional y puedes omitirlo en cualquier momento.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleDismiss(false)}>
            Ahora no
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDismiss(true)}
            variant="outline"
            className="text-muted-foreground"
          >
            No volver a mostrar
          </AlertDialogAction>
          <AlertDialogAction onClick={handleStartTour} className="bg-primary-600 hover:bg-primary-700">
            Iniciar Tour
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

