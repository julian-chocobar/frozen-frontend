"use client"

/**
 * Componente InventoryChart - Gráfico de barras del valor del inventario
 * Muestra la evolución del valor total del inventario
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { mes: "Ene", valor: 6200 },
  { mes: "Feb", valor: 6500 },
  { mes: "Mar", valor: 6800 },
  { mes: "Abr", valor: 7100 },
  { mes: "May", valor: 7300 },
  { mes: "Jun", valor: 7200 },
  { mes: "Jul", valor: 7400 },
  { mes: "Ago", valor: 7500 },
  { mes: "Sep", valor: 7600 },
  { mes: "Oct", valor: 7623 },
]

export function InventoryChart() {
  return (
    <div className="card p-6 border-2 border-primary-600">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-primary-900 mb-1">Valor Total del Inventario</h3>
        <div className="flex items-baseline gap-2">
          <p className="text-3xl font-bold text-primary-900 font-mono">$7623.00</p>
          <span className="text-sm font-medium text-primary-600">+12.5% desde el mes pasado</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#d1d5db" }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={{ stroke: "#d1d5db" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "14px",
            }}
            formatter={(value: number) => [`$${value}`, "Valor"]}
          />
          <Bar dataKey="valor" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
