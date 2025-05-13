import React, { useState, useEffect } from "react"
import { format, isToday, isYesterday, isTomorrow } from "date-fns"
import { Button } from "@/components/ui/button"
import { Calendar as CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Types should match your Booking type
interface Address {
  city: string
  street: string
  street2?: string
  zipCode: string
  province: string
}

interface Booking {
  id: string
  preferred_date: string // ISO string
  agent_name: string
  address: string | Address
  status: string
  property_size?: string
  time?: string // Optionally, if you have a time field
}

interface DayScheduleProps {
  bookings: Booking[]
}

function getDateString(date: Date) {
  return format(date, "yyyy-MM-dd")
}

function formatAddress(address: string | Address, property_size?: string): string {
  if (!address) return ""
  if (typeof address === "string") {
    try {
      const parsed = JSON.parse(address)
      if (typeof parsed === "object" && parsed !== null) {
        address = parsed
      } else {
        return address
      }
    } catch {
      return address
    }
  }
  if (typeof address === "object") {
    const a = address as Address
    // Only street, city, and property size
    return `${a.street || ""}${a.city ? ", " + a.city : ""}${property_size ? ", " + property_size + " sq ft" : ""}`.trim()
  }
  return ""
}

export const DaySchedule: React.FC<DayScheduleProps> = ({ bookings }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [calendarOpen, setCalendarOpen] = useState(false)

  useEffect(() => {
    setSelectedDate(new Date())
  }, [])

  if (!selectedDate) {
    return <div className="bg-white rounded-lg p-6 shadow max-w-sm w-full">Loading...</div>
  }

  // Filter bookings for the selected day
  const filtered = bookings.filter(b => {
    const bookingDate = new Date(b.preferred_date)
    return getDateString(bookingDate) === getDateString(selectedDate)
  })

  // Sort by time if available
  const sorted = filtered.sort((a, b) => {
    const tA = a.time || a.preferred_date
    const tB = b.time || b.preferred_date
    return new Date(tA).getTime() - new Date(tB).getTime()
  })

  function goToPrevDay() {
    setSelectedDate(d => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1) : new Date())
  }
  function goToNextDay() {
    setSelectedDate(d => d ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1) : new Date())
  }
  function goToToday() {
    setSelectedDate(new Date())
  }

  // Helper to get dynamic label
  function getDayLabel(date: Date) {
    if (isToday(date)) return "Today"
    if (isYesterday(date)) return "Yesterday"
    if (isTomorrow(date)) return "Tomorrow"
    return format(date, "MMM d")
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow max-w-sm w-full mt-6 pt-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-semibold">Day Schedule</h2>
        <div className="flex gap-2 items-center">
          <Button variant="outline" size="icon" onClick={goToPrevDay}>&lt;</Button>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant={isToday(selectedDate) ? "default" : "outline"}
                onClick={() => setCalendarOpen(true)}
                aria-label="Pick a date"
              >
                {getDayLabel(selectedDate)}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-auto p-0 overflow-x-auto">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={date => {
                  if (date) setSelectedDate(date)
                  setCalendarOpen(false)
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="icon" onClick={goToNextDay}>&gt;</Button>
        </div>
      </div>
      <div className="text-gray-500 mb-4">{format(selectedDate, "MMMM d, yyyy")}</div>
      <div className="space-y-4">
        {sorted.length === 0 ? (
          <div className="text-gray-400 text-center">No shoots for this day</div>
        ) : (
          sorted.map(b => (
            <div key={b.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-4 border">
              <div>
                <div className="font-semibold text-lg">{format(new Date(b.preferred_date), "h:mm a")}</div>
                <div className="font-medium">{b.agent_name}</div>
                <div className="text-xs text-gray-500">{formatAddress(b.address, b.property_size)}</div>
              </div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  b.status === "Editing" ? "bg-yellow-100 text-yellow-800" :
                  b.status === "Delivered" ? "bg-green-100 text-green-800" :
                  b.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {b.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
} 