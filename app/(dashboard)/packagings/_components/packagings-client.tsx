"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PackagingsTable } from "./packagings-table"
import { PackagingsCards } from "./packagings-cards"
import { PackagingForm } from "./packaging-form"
import { 
  updatePackaging, 
  togglePackagingActive 
} from "@/lib/packagings-api"
import type { PackagingResponse, PackagingUpdateRequest } from "@/types"

interface PackagingsClientProps {
    packagings: PackagingResponse[]
    pagination: {
        currentPage: number
        totalPages: number
        totalElements: number
        size: number
        first: boolean
        last: boolean
    }
}

export function PackagingsClient({ packagings, pagination }: PackagingsClientProps) {
    const router = useRouter()
    const [selectedPackaging, setSelectedPackaging] = useState<PackagingResponse | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleEdit = async (id: string, data: PackagingUpdateRequest) => {
        setIsLoading(true)
        try {
            await updatePackaging(id, data)
            router.refresh()
            setIsEditing(false)
            setSelectedPackaging(null)
        } catch (error) {
            console.error('Error al actualizar packaging:', error)
            alert('Error al actualizar el packaging')
        } finally {
            setIsLoading(false)
        }
    }

    const handleToggleActive = async (packaging: PackagingResponse) => {
        setIsLoading(true)
        try {
            await togglePackagingActive(packaging.id)
            router.refresh()
        } catch (error) {
            console.error('Error al cambiar estado del packaging:', error)
            alert('Error al cambiar el estado del packaging')
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditClick = (packaging: PackagingResponse) => {
        setSelectedPackaging(packaging)
        setIsEditing(true)
    }

    return (
        <>
            <PackagingsTable
                packagings={packagings}
                onEdit={handleEditClick}
                onToggleActive={handleToggleActive}
            />
            <PackagingsCards
                packagings={packagings}
                onEdit={handleEditClick}
                onToggleActive={handleToggleActive}
            />

            {/* Modal para editar packaging */}
            {isEditing && selectedPackaging && (
                <div 
                    className="fixed inset-0 flex items-center justify-center p-4 z-50"
                    style={{ 
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                >
                    <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold mb-4">Editar Packaging</h2>
                            <PackagingForm
                                packaging={selectedPackaging}
                                onSubmit={(data) => handleEdit(selectedPackaging.id, data as PackagingUpdateRequest)}
                                onCancel={() => {
                                    setIsEditing(false)
                                    setSelectedPackaging(null)
                                }}
                                isLoading={isLoading}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}