/**
 * Tipos relacionados con configuración del sistema
 */

// ============================================
// CONFIGURACIÓN DEL SISTEMA
// ============================================

export type DayOfWeek =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY"


export interface WorkingDay {
  dayOfWeek: DayOfWeek
  isWorkingDay: boolean
  openingHour: string 
  closingHour: string 
}

// DTO: SystemConfigurationResponseDTO
export interface SystemConfigurationResponse {
  workingDays: WorkingDay[]
  isActive: boolean
}

// DTO: WorkingDayUpdateDTO 
export interface WorkingDayUpdateRequest {
  dayOfWeek: DayOfWeek
  isWorkingDay: boolean
  openingHour: string 
    closingHour: string 
}
