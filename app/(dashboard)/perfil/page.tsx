"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Header } from "@/components/layout/header"
import { Save, Eye, EyeOff, User as UserIcon, Mail, Shield, Lock } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { getUserById, updateUser, updateUserPassword } from "@/lib/users-api"
import { handleError, showSuccess } from "@/lib/error-handler"
import type { UserDetail, UserUpdateRequest, UpdatePasswordRequest } from "@/types"
import { getRoleLabel } from "@/lib/users-api"

/**
 * Página de Edición de Perfil de Usuario
 * - Editar nombre
 * - Ver email (no editable)
 * - Cambiar contraseña
 * - Ver rol (no editable)
 */

export default function PerfilPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Estados del perfil
  const [userDetail, setUserDetail] = useState<UserDetail | null>(null)
  const [nombre, setNombre] = useState("")
  const [email, setEmail] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [roles, setRoles] = useState<string[]>([])
  
  // Estados de contraseña
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  // Cargar datos del usuario
  useEffect(() => {
    const loadUserData = async () => {
      // Verificar que el usuario existe y tiene ID válido
      if (!user?.id || user.id === '' || user.id === 'undefined') {
        console.log('⚠️ Usuario sin ID válido:', user)
        setIsLoadingData(false)
        return
      }
      
      setIsLoadingData(true)
      try {
        // Convertir ID a número (el backend devuelve numbers)
        const userId = typeof user.id === 'number' ? user.id : parseInt(user.id)
        
        if (isNaN(userId)) {
          console.error('❌ ID de usuario inválido:', user.id)
          setIsLoadingData(false)
          return
        }
        
        const userData = await getUserById(userId)
        setUserDetail(userData)
        setNombre(userData.name)
        setEmail(userData.email || "")
        setPhoneNumber(userData.phoneNumber || "")
        setRoles(userData.roles)
      } catch (error) {
        console.error('Error loading user data:', error)
        handleError(error, { title: 'Error al cargar datos del usuario' })
        setIsLoadingData(false)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadUserData()
  }, [user])

  const handleSaveProfile = async () => {
    if (!user?.id || !userDetail) return
    
    setIsLoading(true)
    try {
      const userId = parseInt(user.id)
      const updateData: UserUpdateRequest = {
        name: nombre,
        email: email || undefined,
        phoneNumber: phoneNumber || undefined
      }
      
      await updateUser(userId, updateData)
      showSuccess('Perfil actualizado exitosamente')
      router.refresh()
    } catch (error) {
      handleError(error, { title: 'Error al actualizar perfil' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      showSuccess('Las contraseñas no coinciden', 'error')
      return
    }
    
    if (newPassword.length < 8) {
      showSuccess('La contraseña debe tener al menos 8 caracteres', 'error')
      return
    }

    if (!user?.id) return
    
    setIsLoading(true)
    try {
      const userId = parseInt(user.id)
      const passwordData: UpdatePasswordRequest = {
        password: newPassword,
        passwordConfirmacion: confirmPassword,
        passwordMatching: newPassword === confirmPassword
      }
      
      await updateUserPassword(userId, passwordData)
      showSuccess('Contraseña actualizada exitosamente')
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordSection(false)
    } catch (error) {
      handleError(error, { title: 'Error al cambiar contraseña' })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <>
        <Header
          title="Mi Perfil"
          subtitle="Administra tu información personal y preferencias"
          backButton={{ onClick: () => router.back() }}
        />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </>
    )
  }

  if (!userDetail) {
    return (
      <>
        <Header
          title="Mi Perfil"
          subtitle="Administra tu información personal y preferencias"
          backButton={{ onClick: () => router.back() }}
        />
        <div className="flex items-center justify-center h-[60vh] px-4">
          <p className="text-primary-700 text-sm md:text-base">
            No se pudieron cargar los datos del usuario
          </p>
        </div>
      </>
    )
  }

  return (
    <>
      <Header
        title="Mi Perfil"
        subtitle="Administra tu información personal y preferencias"
        backButton={{ onClick: () => router.back() }}
      />
      <div className="px-4 md:px-6 pb-20 md:pb-10 flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          {/* Card principal */}
          <div className="bg-surface border-2 border-border rounded-lg p-6 md:p-8 shadow-card space-y-8">
          {/* Avatar fijo */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Identidad</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-primary-600 overflow-hidden bg-primary-100 flex items-center justify-center">
                  <UserIcon className="w-16 h-16 text-primary-600" />
                </div>
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-lg font-semibold text-primary-900">{userDetail.name}</p>
                <p className="text-sm text-primary-600">@{userDetail.username}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-stroke" />

          {/* Información personal */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Información Personal</h3>
            <div className="space-y-4">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre" className="text-sm font-semibold text-foreground">
                  Nombre completo *
                </Label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <Input
                    id="nombre"
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="pl-10 h-11"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">
                  Correo electrónico
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11"
                    placeholder="usuario@frozen.com (opcional)"
                  />
                </div>
              </div>

              {/* Teléfono */}
              <div className="space-y-2">
                <Label htmlFor="telefono" className="text-sm font-semibold text-foreground">
                  Teléfono
                </Label>
                <div className="relative">
                  <Input
                    id="telefono"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 h-11"
                    placeholder="+54 9 1234 5678 (opcional)"
                  />
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Roles
                </Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {roles.map(role => (
                    <span
                      key={role}
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 border border-primary-300"
                    >
                      {getRoleLabel(role as any)}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-primary-600">Los roles son asignados por el administrador</p>
              </div>
            </div>
          </div>

          <div className="border-t border-stroke" />

          {/* Seguridad */}
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Seguridad</h3>
                <p className="text-sm text-primary-600">Administra tu contraseña y configuración de seguridad</p>
              </div>
              {!showPasswordSection && (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordSection(true)}
                  className="border-primary-300 text-primary-600 hover:bg-primary-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>Cambiar contraseña</span>
                </Button>
              )}
            </div>

            {showPasswordSection && (
              <div className="space-y-4 p-4 bg-surface-secondary rounded-lg border border-primary-200">
                {/* Contraseña actual */}
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-semibold text-foreground">
                    Contraseña actual
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <Input
                      id="current-password"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Tu contraseña actual"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Nueva contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="new-password" className="text-sm font-semibold text-foreground">
                    Nueva contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Mínimo 8 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-2">
                  <Label htmlFor="confirm-password" className="text-sm font-semibold text-foreground">
                    Confirmar nueva contraseña
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-primary-400" />
                    <Input
                      id="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite la nueva contraseña"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-500 hover:text-primary-700 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Botones de contraseña */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button
                    onClick={handleChangePassword}
                    disabled={isLoading || !currentPassword || !newPassword || !confirmPassword}
                    className="flex-1"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Guardando...</span>
                      </div>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Guardar contraseña</span>
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowPasswordSection(false)
                      setCurrentPassword("")
                      setNewPassword("")
                      setConfirmPassword("")
                    }}
                    disabled={isLoading}
                    className="border-primary-200 text-primary-600 hover:bg-primary-50"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-stroke" />

          {/* Botón guardar perfil */}
          <div className="flex justify-end">
            <Button
              onClick={handleSaveProfile}
              disabled={isLoading}
              size="lg"
              variant="outline"
              className="min-w-[200px] border-primary-300 text-primary-700 hover:bg-primary-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-200 border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Guardar cambios</span>
                </>
              )}
            </Button>
          </div>
        </div>

          {/* Card de información adicional */}
          <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-4">
            <p className="text-sm text-primary-800">
              <strong>Nota:</strong> Si necesitas cambiar tu correo electrónico o rol, por favor contacta con el administrador del sistema.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

