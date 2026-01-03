"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description: string
  onClick?: () => void
  active?: boolean
  colorClass: string
}

export function StatCard({ title, value, icon: Icon, description, onClick, active, colorClass }: StatCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-l-4 ${
        active ? `${colorClass}-bg ${colorClass}-border` : `${colorClass}-border-hover`
      }`}
      onClick={onClick}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${active ? `${colorClass}-text-active` : `${colorClass}-text`}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-gray-500">{description}</p>
      </CardContent>
    </Card>
  )
}
