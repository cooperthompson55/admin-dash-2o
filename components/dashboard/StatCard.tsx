import React from 'react'

export function StatCard({ 
  icon, 
  value, 
  label, 
  color,
  onClick 
}: { 
  icon: React.ReactNode, 
  value: React.ReactNode, 
  label: string, 
  color: string,
  onClick?: () => void 
}) {
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-white rounded-xl shadow-sm p-3 sm:p-4 w-full aspect-square ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className={`rounded-full w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center mb-1 sm:mb-2 ${color}`}>
        <div className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6">
          {icon}
        </div>
      </div>
      <div className="text-lg sm:text-xl md:text-2xl font-bold mb-1 text-gray-900 text-center">{value}</div>
      <div className="text-xs sm:text-sm text-gray-500 font-medium text-center leading-tight">{label}</div>
    </div>
  )
} 