"use client"

/**
 * Componente UsageTrendsChart - Gráfico de tendencias de uso de materiales
 * Muestra el consumo de diferentes categorías de materiales a lo largo del tiempo
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useState } from "react"
import { cn } from "@/lib/utils"

const data = [
  { mes: "Lun", maltas: 25, lupulos: 8, levaduras: 12 },
  { mes: "Mar", maltas: 32, lupulos: 10, levaduras: 14 },
  { mes: "Mié", maltas: 45, lupulos: 12, levaduras: 16 },
  { mes: "Jue", maltas: 52, lupulos: 14, levaduras: 18 },
  { mes: "Vie", maltas: 48, lupulos: 13, levaduras: 17 },
  { mes: "Sáb", maltas: 55, lupulos: 15, levaduras: 20 },
  { mes: "Dom", maltas: 42, lupulos: 11, levaduras: 15 },
]

type TimeRange = "Semana" | "Mes"

export function UsageTrendsChart() {
  const [timeRange, setTimeRange] = useState<TimeRange>("Semana")

  return (
    <div className="card p-6 border-2 border-primary-600">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-primary-900 mb-1">Tendencias de Uso de Materiales</h3>
          <p className="text-sm text-primary-600">Rastrea tus patrones de consumo a lo largo del tiempo</p>
        </div>

        {/* Selector de rango de tiempo */}
        <div className="flex gap-2">
          <button
            onClick={() => setTimeRange("Semana")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary-300",
              timeRange === "Semana"
                ? "bg-primary-600 text-white"
                : "bg-surface-secondary text-primary-900 hover:bg-stroke",
            )}
          >
            Semana
          </button>
          <button
            onClick={() => setTimeRange("Mes")}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-primary-300",
              timeRange === "Mes"
                ? "bg-primary-600 text-white"
                : "bg-surface-secondary text-primary-900 hover:bg-stroke",
            )}
          >
            Mes
          </button>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#d1d5db" }} />
          <YAxis
            tick={{ fill: "#6b7280", fontSize: 12 }}
            axisLine={{ stroke: "#d1d5db" }}
            label={{ value: "kg", angle: -90, position: "insideLeft", fill: "#6b7280" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "14px" }} iconType="line" />
          <Line
            type="monotone"
            dataKey="maltas"
            stroke="#2563eb"
            strokeWidth={2}
            name="Maltas"
            dot={{ fill: "#2563eb", r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="lupulos"
            stroke="#1d4ed8"
            strokeWidth={2}
            name="Lúpulos"
            dot={{ fill: "#1d4ed8", r: 4 }}
            strokeDasharray="5 5"
          />
          <Line
            type="monotone"
            dataKey="levaduras"
            stroke="#1e40af"
            strokeWidth={2}
            name="Levaduras"
            dot={{ fill: "#1e40af", r: 4 }}
            strokeDasharray="3 3"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
