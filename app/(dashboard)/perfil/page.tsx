"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, Save, X, Eye, EyeOff, User, Mail, Shield, Lock, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import Image from "next/image"

/**
 * Página de Edición de Perfil de Usuario
 * - Cambiar foto de perfil
 * - Editar nombre representativo
 * - Ver email (no editable)
 * - Cambiar contraseña
 * - Ver rol (no editable)
 */

export default function PerfilPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  // Estados del perfil
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [nombre, setNombre] = useState("Admin Usuario")
  const [email] = useState("admin@frozen.com") // No editable
  const [rol] = useState("Maestro Cervecero") // No editable
  
  // Estados de contraseña
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPasswordSection, setShowPasswordSection] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setProfileImage(null)
  }

  const handleSaveProfile = async () => {
    setIsLoading(true)
    
    // Simular guardado
    setTimeout(() => {
      setIsLoading(false)
      // Aquí iría la lógica de guardado real
      alert("Perfil actualizado exitosamente")
      // Redirigir al inicio
      router.push("/")
    }, 1500)
  }

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden")
      router.push("/perfil")
    }
    
    if (newPassword.length < 4) {
      alert("La contraseña debe tener al menos 4 caracteres")
      return
    }

    setIsLoading(true)
    
    // Simular cambio de contraseña
    setTimeout(() => {
      setIsLoading(false)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setShowPasswordSection(false)
      alert("Contraseña actualizada exitosamente")
    }, 1500)
  }

  return (
    <div className="flex justify-center pb-20 md:pb-6">
      <div className="w-full max-w-3xl">
        {/* Header */}
        <div className="mb-0 px-4 md:px-0">
          <h1 className="text-2xl md:text-3xl font-bold text-primary-800">Mi Perfil</h1>
          <p className="text-sm text-muted mt-1">Administra tu información personal y preferencias</p>
        </div>

        {/* Card principal con botón de regreso */}
        <div className="relative bottom-5 mb-[-18px]">
          {/* Botón de regreso - Volver a página anterior */}
          <div className="relative  left-[-115px] bottom-[-40px]">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver</span>
            </button>
          </div>

          <div className="bg-surface border-2 border-border rounded-lg p-6 md:p-8 shadow-card">
        <div className="space-y-8">
          {/* Foto de perfil */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Foto de Perfil</h3>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-border overflow-hidden bg-primary-100 flex items-center justify-center">
                  {profileImage ? (
                    <Image
                      src={profileImage}
                      alt="Foto de perfil"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-16 h-16 text-primary-600" />
                  )}
                </div>
                {profileImage && (
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    aria-label="Eliminar foto"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Botones */}
              <div className="flex-1 space-y-3">
                <label htmlFor="profile-image" className="cursor-pointer">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                    <Camera className="w-4 h-4" />
                    <span>Cambiar foto</span>
                  </div>
                  <input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                <p className="text-sm text-muted">
                  Formatos recomendados: JPG, PNG o GIF. Tamaño máximo: 5MB
                </p>
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
                  Nombre completo
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
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

              {/* Email (no editable) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Correo electrónico
                  <span className="text-xs text-muted font-normal">(No se puede modificar)</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    className="pl-10 h-11 bg-surface-secondary cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>

              {/* Rol (no editable) */}
              <div className="space-y-2">
                <Label htmlFor="rol" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  Rol
                  <span className="text-xs text-muted font-normal">(No se puede modificar)</span>
                </Label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                  <Input
                    id="rol"
                    type="text"
                    value={rol}
                    className="pl-10 h-11 bg-surface-secondary cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-stroke" />

          {/* Seguridad */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Seguridad</h3>
                <p className="text-sm text-muted">Administra tu contraseña y configuración de seguridad</p>
              </div>
              {!showPasswordSection && (
                <Button
                  variant="outline"
                  onClick={() => setShowPasswordSection(true)}
                  className="border-primary-300 text-primary-600 hover:bg-primary-50"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Cambiar contraseña
                </Button>
              )}
            </div>

            {showPasswordSection && (
              <div className="space-y-4 p-4 bg-surface-secondary rounded-lg">
                {/* Contraseña actual */}
                <div className="space-y-2">
                  <Label htmlFor="current-password" className="text-sm font-semibold text-foreground">
                    Contraseña actual
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
                    <Input
                      id="new-password"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Mínimo 4 caracteres"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 h-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
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
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
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
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Botones de contraseña */}
                <div className="flex gap-3 pt-2">
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
                        <Save className="w-4 h-4 mr-2" />
                        Guardar contraseña
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
              className="min-w-[200px]"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Guardando...</span>
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Guardar cambios
                </>
              )}
            </Button>
          </div>
        </div>
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
  )
}

