"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft } from "lucide-react"
import { format, parse } from "date-fns"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function BookingDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.id as string
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState<any>({})
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBooking() {
      setLoading(true)
      const { data, error } = await supabase.from("bookings").select("*").eq("id", bookingId).single()
      if (error) setError("Failed to load booking.")
      setBooking(data)
      setForm(data)
      setLoading(false)
    }
    if (bookingId) fetchBooking()
  }, [bookingId])

  const handleChange = (field: string, value: any) => {
    console.log(`Changing ${field} to:`, value)
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    let updatedForm = { ...form }
    
    // Format time properly for Supabase time column
    if (updatedForm.time) {
      console.log('Original time value:', updatedForm.time)
      
      // If time is in HH:mm format, append :00
      if (updatedForm.time.length === 5) {
        updatedForm.time = updatedForm.time + ':00'
      }
      // If time is in HH:mm:ss format, ensure it's valid
      else if (updatedForm.time.length === 8) {
        // Validate the time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
        if (!timeRegex.test(updatedForm.time)) {
          setError("Invalid time format. Please use HH:mm:ss format.")
          setSaving(false)
          return
        }
      }
      
      console.log('Formatted time for Supabase:', updatedForm.time)
    }

    try {
      // Use the same update endpoint as the main dashboard
      const response = await fetch('/api/bookings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([updatedForm]), // Wrap in array as the endpoint expects an array
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save changes')
      }

      const { data } = await response.json()
      console.log('Save successful:', data)
      
      if (data && data[0]) {
        setBooking(data[0])
        setForm(data[0])
        setEditing(false)
      } else {
        throw new Error('No data returned after update')
      }
    } catch (err) {
      console.error('Error in save operation:', err)
      setError(err instanceof Error ? err.message : "Failed to save changes")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!booking) {
    return <div className="p-8 text-center text-gray-500">Booking not found.</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Booking Details</h1>
      </div>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Client Information */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">Client Information</h2>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Full Name</span>{booking.agent_name}</div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Email</span>{booking.agent_email}</div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Phone</span>{booking.agent_phone}</div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Company</span>{booking.agent_company || "N/A"}</div>
        </div>
        {/* Property Information */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">Property Information</h2>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Full Address</span>{typeof booking.address === "string" ? booking.address : `${booking.address.street}, ${booking.address.city}, ${booking.address.province}`}</div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Property Size</span>{booking.property_size}</div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Occupancy Status</span>{booking.property_status}</div>
        </div>
        {/* Booking Metadata */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">Booking Metadata</h2>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Preferred Date</span>{booking.preferred_date}</div>
          <div className="mb-2">
            <span className="text-xs text-gray-500 block">Time</span>
            {editing ? (
              <input
                type="time"
                className="border rounded px-2 py-1 text-sm"
                value={form.time ? form.time.substring(0, 5) : ""}
                onChange={e => {
                  console.log('Time input changed:', e.target.value)
                  handleChange("time", e.target.value)
                }}
              />
            ) : (
              booking.time
                ? format(parse(booking.time, "HH:mm:ss", new Date()), "h:mm a")
                : "N/A"
            )}
          </div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Created</span>{booking.created_at}</div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Payment Status</span>{booking.payment_status}</div>
          <div className="mb-2"><span className="text-xs text-gray-500 block">Job Status</span>{booking.status}</div>
        </div>
        {/* Services Booked */}
        <div className="bg-white rounded-lg p-6 border">
          <h2 className="text-lg font-semibold mb-4">Services Booked</h2>
          <div>{Array.isArray(booking.services) ? booking.services.map((s: any, i: number) => <div key={i}>{s.name} - ${s.price}</div>) : booking.services}</div>
          <div className="mt-4 font-bold">Total: ${booking.total_amount}</div>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button variant="outline" onClick={() => setEditing(true)} disabled={editing}>Edit Booking</Button>
        <Button onClick={handleSave} disabled={!editing || saving} className="bg-blue-600 text-white">{saving ? "Saving..." : "Save Changes"}</Button>
      </div>
    </div>
  )
} 