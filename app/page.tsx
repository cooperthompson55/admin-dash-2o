"use client"

import { useEffect, useState, useCallback, useRef, Suspense } from "react"
import { createClient } from "@supabase/supabase-js"
import { BookingsTable } from "@/components/bookings-table"
import { TopNavigation } from "@/components/top-navigation"
import { Loader2, RefreshCw, Bell, User, FileText, Calendar, PlusCircle, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatRelativeTime } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { DaySchedule } from "@/components/day-schedule"
import { MetricsPanel } from "@/components/dashboard/MetricsPanel"

// Import shared constants
import { 
  getDiscountInfo,
  applyDiscount,
  formatPropertySizeDisplay
} from "@/lib/constants"

// Define the Booking type
type Booking = {
  id: string
  created_at: string
  property_size: string
  services: any
  total_amount: number
  address: any
  notes: string
  preferred_date: string
  property_status: string
  status: string
  payment_status: string
  editing_status: string
  user_id: string | null
  agent_name: string
  agent_email: string
  agent_phone: number
  agent_company: string
  reference_number: string
  selected_package_name: string | null
  additional_instructions: string | null
  property_type: string | null
  bedrooms: number | null
  bathrooms: number | null
  parking_spaces: number | null
  suite_unit: string | null
  access_instructions: string | null
  agent_designation: string | null
  agent_brokerage: string | null
  feature_sheet_content: string | null
  promotion_code: string | null
}

// Create Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Polling interval in milliseconds (30 seconds for more frequent checks)
const POLLING_INTERVAL = 30 * 1000

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newBookingsCount, setNewBookingsCount] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>("all")
  const [editingStatusFilter, setEditingStatusFilter] = useState<string>("all")
  const previousBookingCount = useRef(0)
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const { toast } = useToast()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log("Testing Supabase connection...")
        console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log("Supabase Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        
        const { data, error } = await supabase
          .from('bookings')
          .select('count')
          .limit(1)
        
        if (error) {
          console.error("Supabase connection test failed:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
        } else {
          console.log("Supabase connection test successful:", data)
        }
      } catch (err) {
        console.error("Unexpected error testing connection:", err)
      }
    }
    
    testConnection()
  }, [])

  // Function to fetch all bookings
  const fetchBookings = useCallback(
    async (isManualRefresh = false, silent = false) => {
      try {
        if (isManualRefresh) {
          setRefreshing(true)
        } else if (!lastUpdated && !silent) {
          setLoading(true)
        }

        if (!silent) setError(null)

        console.log("Fetching bookings...", new Date().toISOString())

        // Only fetch the last 30 days of bookings by default
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const { data, error: supabaseError } = await supabase
          .from("bookings")
          .select("id, created_at, property_size, services, total_amount, address, notes, preferred_date, property_status, status, payment_status, editing_status, user_id, agent_name, agent_email, agent_phone, agent_company, reference_number, selected_package_name, additional_instructions, property_type, bedrooms, bathrooms, parking_spaces, suite_unit, access_instructions, agent_designation, agent_brokerage, feature_sheet_content, promotion_code")
          .gte('created_at', thirtyDaysAgo.toISOString())
          .order("created_at", { ascending: false })
          .limit(100) // Limit to 100 bookings at a time

        if (supabaseError) {
          console.error("Error fetching bookings:", {
            message: supabaseError.message,
            details: supabaseError.details,
            hint: supabaseError.hint,
            code: supabaseError.code
          })
          if (!silent) setError("Failed to load bookings. Please try again.")
          return
        }

        // Add debug logging for successful query
        console.log("Supabase query successful:", {
          dataLength: data?.length,
          firstBooking: data?.[0],
          queryDate: thirtyDaysAgo.toISOString()
        })

        // Check if we have new bookings
        if (previousBookingCount.current > 0 && data && data.length > previousBookingCount.current) {
          const newCount = data.length - previousBookingCount.current
          setNewBookingsCount(newCount)

          // Show notification
          toast({
            title: `${newCount} New Booking${newCount > 1 ? "s" : ""}`,
            description: "New bookings have been received",
            variant: "default",
          })

          console.log(`${newCount} new bookings detected!`)
        }

        // Update the previous count
        previousBookingCount.current = data ? data.length : 0

        if (!silent) {
          setBookings(data || [])
          setLastUpdated(new Date())
        }

        return data
      } catch (err) {
        console.error("Error fetching bookings:", err)
        if (!silent) setError("An unexpected error occurred. Please try again.")
      } finally {
        if (!silent) {
          setLoading(false)
          setRefreshing(false)
        }
      }
    },
    [lastUpdated, toast],
  )

  // Function to schedule the next poll
  const schedulePoll = useCallback(() => {
    // Clear any existing timeout
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current)
    }

    // Schedule the next poll
    pollTimeoutRef.current = setTimeout(async () => {
      console.log("Polling for new bookings...", new Date().toISOString())
      const newData = await fetchBookings(false, true)

      if (newData && (!bookings.length || JSON.stringify(newData) !== JSON.stringify(bookings))) {
        console.log("New data detected, updating UI")
        setBookings(newData)
        setLastUpdated(new Date())
      } else {
        console.log("No changes detected")
      }

      // Schedule the next poll
      schedulePoll()
    }, POLLING_INTERVAL)
  }, [bookings, fetchBookings])

  // Initial data fetch and set up polling
  useEffect(() => {
    // Fetch data immediately on page load
    fetchBookings()

    // Set up visibility change detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        console.log("Tab is now visible, fetching fresh data")
        fetchBookings()
      }
    }

    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // Start polling
    schedulePoll()

    // Clean up
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current)
      }
    }
  }, [fetchBookings, schedulePoll])

  // Handle manual refresh
  const handleManualRefresh = () => {
    fetchBookings(true)
    setNewBookingsCount(0)
  }

  const handleFilterChange = (filters: { status?: string, paymentStatus?: string, editingStatus?: string }) => {
    if (filters.status) setStatusFilter(filters.status)
    if (filters.paymentStatus) setPaymentStatusFilter(filters.paymentStatus)
    if (filters.editingStatus) setEditingStatusFilter(filters.editingStatus)
  }

  // Calculate metrics for widgets
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const editingJobs = bookings.filter(b => b.editing_status === 'in_editing').length;
  const unpaidBookings = bookings.filter(b => b.payment_status === 'not_paid').length;
  const completedThisWeek = bookings.filter(b => b.status === 'completed' && new Date(b.preferred_date) >= startOfWeek && new Date(b.preferred_date) < endOfWeek).length;
  const revenueThisWeek = bookings
    .filter(b => b.status === 'completed' && b.payment_status === 'paid' && new Date(b.preferred_date) >= startOfWeek && new Date(b.preferred_date) < endOfWeek)
    .reduce((sum, b) => sum + applyDiscount(b.total_amount || 0), 0)
    .toLocaleString('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar for desktop, overlay for mobile/narrow desktop */}
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 bg-white text-gray-900 flex-col py-8 px-4 min-h-screen shadow-lg border-r border-gray-200 rounded-r-3xl z-20 transition-all duration-300">
        <div className="flex flex-col items-center mb-8">
          <img src="/rephotos-logo.png" alt="RePhotos Logo" className="h-20 w-auto mb-2" />
        </div>
        <nav className="flex flex-col gap-2">
          {/* Quick Links (Agent Reach first) */}
          <a href="https://courageous-melba-d599a1.netlify.app/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
            <span className="inline-block"><User className="w-4 h-4" /></span>Agent Reach
          </a>
          <a href="https://app.pixlmob.com/maidanghung" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
            <span className="inline-block"><User className="w-4 h-4" /></span>Editor Profile
          </a>
          <a href="https://app.squareup.com/dashboard/invoices/new" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
            <span className="inline-block"><FileText className="w-4 h-4" /></span>Generate Invoice
          </a>
          <span className="px-3 py-2 rounded-lg font-medium transition flex items-center gap-2 opacity-50 cursor-not-allowed">
            <span className="inline-block"><Calendar className="w-4 h-4" /></span>Open Calendar
          </span>
          <a href="https://www.rephotos.ca/book-now" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
            <span className="inline-block"><PlusCircle className="w-4 h-4" /></span>New Booking
          </a>
          <a href="https://app.netlify.com/teams/cooperthompson55955/projects" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
            <span className="inline-block"><Globe className="w-4 h-4" /></span>Netlify Projects
          </a>
        </nav>
      </aside>
      {/* Overlay sidebar for mobile and narrow desktop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-30" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-white text-gray-900 flex flex-col py-8 px-4 shadow-lg border-r border-gray-200 rounded-r-3xl z-50 animate-slide-in">
            <div className="flex flex-col items-center mb-8">
              <img src="/rephotos-logo.png" alt="RePhotos Logo" className="h-20 w-auto mb-2" />
            </div>
            <nav className="flex flex-col gap-2">
              {/* Quick Links (Agent Reach first) */}
              <a href="https://courageous-melba-d599a1.netlify.app/" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
                <span className="inline-block"><User className="w-4 h-4" /></span>Agent Reach
              </a>
              <a href="https://app.pixlmob.com/maidanghung" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
                <span className="inline-block"><User className="w-4 h-4" /></span>Editor Profile
              </a>
              <a href="https://app.squareup.com/dashboard/invoices/new" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
                <span className="inline-block"><FileText className="w-4 h-4" /></span>Generate Invoice
              </a>
              <span className="px-3 py-2 rounded-lg font-medium transition flex items-center gap-2 opacity-50 cursor-not-allowed">
                <span className="inline-block"><Calendar className="w-4 h-4" /></span>Open Calendar
              </span>
              <a href="https://www.rephotos.ca/book-now" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
                <span className="inline-block"><PlusCircle className="w-4 h-4" /></span>New Booking
              </a>
              <a href="https://app.netlify.com/teams/cooperthompson55955/projects" target="_blank" rel="noopener noreferrer" className="px-3 py-2 rounded-lg hover:bg-gray-100 font-medium transition flex items-center gap-2">
                <span className="inline-block"><Globe className="w-4 h-4" /></span>Netlify Projects
              </a>
            </nav>
          </aside>
        </div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <TopNavigation onBurgerClick={() => setSidebarOpen((v) => !v)} />
        <main className="flex-1 w-full px-4 py-6 md:py-8">
          {/* Responsive Grid Layout - ensures proper sizing on all screen sizes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
            {/* Day Schedule - takes full width on mobile, half on medium */}
            <div className="w-full">
              <DaySchedule bookings={bookings} />
            </div>
            
            {/* Metrics Panel - takes full width on mobile, half on medium */}
            <div className="w-full">
              <MetricsPanel
                totalBookings={totalBookings}
                pendingBookings={pendingBookings}
                editingJobs={editingJobs}
                unpaidBookings={unpaidBookings}
                completedThisWeek={completedThisWeek}
                revenueThisWeek={revenueThisWeek}
                onFilterChange={handleFilterChange}
              />
            </div>
          </div>
          
          <div className="w-full">
            <h2 className="text-2xl font-semibold mb-4">All Bookings</h2>
            <BookingsTable 
              bookings={bookings} 
              onRefresh={handleManualRefresh}
              initialStatusFilter={statusFilter}
              initialPaymentStatusFilter={paymentStatusFilter}
              initialEditingStatusFilter={editingStatusFilter}
            />
          </div>
        </main>
        {/* Debug info - remove in production */}
        <div className="mt-8 text-xs text-gray-400 border-t pt-4">
          <p>Polling interval: {POLLING_INTERVAL / 1000} seconds</p>
        </div>
      </div>
    </div>
  )
}
