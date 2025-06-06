"use client"

import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Loader2, ArrowLeft, ArrowUp, ArrowDown, X, Check, FolderPlus, Mail, Copy, CheckCheck } from "lucide-react"
import { format, parse } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { CreateEmailModal } from '../../components/modals/create-email-modal'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define an interface for address objects used in this page
interface PageAddress {
  street: string;
  street2?: string;
  city: string;
  province: string;
  zipCode: string;
}

type Service = { name: string; price: number };

const SERVICE_CATALOG: Record<string, Service[]> = {
  '0–999 sq ft': [
    { name: 'HDR Photography', price: 189.99 },
    { name: '360° Virtual Tour', price: 199.99 },
    { name: 'Property Highlights Video', price: 289.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 229.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 119.99 },
    { name: '3D House Model', price: 189.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '1000–1999 sq ft': [
    { name: 'HDR Photography', price: 249.99 },
    { name: '360° Virtual Tour', price: 239.99 },
    { name: 'Property Highlights Video', price: 309.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 249.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 149.99 },
    { name: '3D House Model', price: 229.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '2000–2999 sq ft': [
    { name: 'HDR Photography', price: 319.99 },
    { name: '360° Virtual Tour', price: 279.99 },
    { name: 'Property Highlights Video', price: 349.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 279.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 189.99 },
    { name: '3D House Model', price: 269.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '3000–3999 sq ft': [
    { name: 'HDR Photography', price: 379.99 },
    { name: '360° Virtual Tour', price: 319.99 },
    { name: 'Property Highlights Video', price: 379.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 299.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 229.99 },
    { name: '3D House Model', price: 299.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
  '4000–4999 sq ft': [
    { name: 'HDR Photography', price: 439.99 },
    { name: '360° Virtual Tour', price: 349.99 },
    { name: 'Property Highlights Video', price: 409.99 },
    { name: 'Slideshow Video Tour', price: 99.99 },
    { name: 'Social Media Reel', price: 329.99 },
    { name: 'Drone Aerial Photos', price: 159.99 },
    { name: 'Drone Aerial Video', price: 159.99 },
    { name: '2D Floor Plan', price: 269.99 },
    { name: '3D House Model', price: 339.99 },
    { name: 'Property Website', price: 129.99 },
    { name: 'Custom Domain Name', price: 39.99 },
    { name: 'Virtual Declutter', price: 29.99 },
    { name: 'Virtual Staging', price: 39.99 },
    { name: 'Virtual Twilight', price: 49.99 },
  ],
};

// Property size and occupancy status options
const PROPERTY_SIZE_OPTIONS = [
  '0–999 sq ft',
  '1000–1999 sq ft',
  '2000–2999 sq ft',
  '3000–3999 sq ft',
  '4000–4999 sq ft',
];
const OCCUPANCY_STATUS_OPTIONS = ['Vacant', 'Occupied', 'Tenanted', 'Other'];

// Add this helper function near the top of the file
function getShortLink(link: string, maxLength = 30) {
  if (!link) return '';
  return link.length > maxLength ? link.slice(0, maxLength) + '...' : link;
}

// Restore and update TruncatedLink to use getShortLink by default
const TruncatedLink = ({ href, children, maxLength = 30 }: { href: string; children?: React.ReactNode; maxLength?: number }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="truncate text-blue-600 hover:underline max-w-[160px] sm:max-w-[220px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-[500px] block"
          style={{ display: 'inline-block', verticalAlign: 'middle' }}
        >
          {children ?? getShortLink(href, maxLength)}
        </a>
      </TooltipTrigger>
      <TooltipContent>
        <p className="break-all max-w-[400px]">{href}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)

// Add this helper function near the top of the file, after SERVICE_CATALOG
const getDiscountInfo = (total: number) => {
  if (total >= 1100) return { percent: 17, min: 1100, max: Infinity };
  if (total >= 900) return { percent: 15, min: 900, max: 1099.99 };
  if (total >= 700) return { percent: 12, min: 700, max: 899.99 };
  if (total >= 500) return { percent: 10, min: 500, max: 699.99 };
  if (total >= 350) return { percent: 5, min: 350, max: 499.99 };
  if (total >= 199.99) return { percent: 3, min: 199.99, max: 349.99 };
  return { percent: 0, min: 0, max: 199.98 };
};

const applyDiscount = (total: number) => {
  const { percent } = getDiscountInfo(total);
  return total * (1 - percent / 100);
};

// Updated getGoogleMapsLink function
const getGoogleMapsLink = (addressInput: string | PageAddress | null | undefined): string => {
  if (!addressInput) return '#';

  let addressString: string;
  if (typeof addressInput === 'string') {
    addressString = addressInput;
  } else if (typeof addressInput === 'object' && addressInput !== null) {
    // Street is crucial for a meaningful map link from an object
    if (!addressInput.street) return '#'; 
    addressString = `${addressInput.street || ''}${addressInput.street2 ? `, ${addressInput.street2}` : ''}, ${addressInput.city || ''}, ${addressInput.province || ''} ${addressInput.zipCode || ''}`;
  } else {
    return '#'; // Not a string or a recognized object
  }

  // Basic cleanup for the address string
  addressString = addressString.replace(/\s*,\s*/g, ", ").replace(/^,\s*|\s*,$/g, "").trim();
  
  if (!addressString || addressString === "," || /^\s*$/.test(addressString) || addressString.toLowerCase() === "address not available" || addressString.toLowerCase() === "address details incomplete") {
      return "#";
  }

  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(addressString)}`;
};

// Add this function before the BookingDetailsPage component
function composeMediaReadyEmail(booking: any) {
  const clientFirstName = booking.agent_name.split(' ')[0]
  const address = typeof booking.address === 'string' ? booking.address : JSON.stringify(booking.address)
  const services = typeof booking.services === 'string' ? JSON.parse(booking.services) : booking.services
  const servicesList = services.map((service: any) => `${service.name} (${service.count})`).join(', ')
  
  const emailBody = `Hi ${clientFirstName},

Thanks again for choosing RePhotos! Your final media for the listing at ${address} is now ready.

📍 Property: ${address}
📅 Shoot Date: ${booking.preferred_date} ${booking.time || ''}
📦 Services Completed: ${servicesList}

🔗 Final Media Download: ${booking.final_edits_link || 'Link not available'}
💸 Invoice: ${booking.invoice_link || 'Link not available'}

If you have any questions or need revisions, just let us know. We look forward to working with you again soon!

Best,
Cooper
Rephotos.ca`

  const subject = `Your Final Photos for ${address} Are Ready!`
  const mailtoLink = `mailto:${booking.agent_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`
  
  return mailtoLink
}

// Add status option arrays near the top of the file
const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", color: "bg-yellow-100 text-yellow-800", hoverColor: "hover:bg-yellow-200" },
  { value: "editing", label: "Editing", color: "bg-purple-100 text-purple-800", hoverColor: "hover:bg-purple-200" },
  { value: "delivered", label: "Delivered", color: "bg-blue-100 text-blue-800", hoverColor: "hover:bg-blue-200" },
  { value: "completed", label: "Completed", color: "bg-green-100 text-green-800", hoverColor: "hover:bg-green-200" },
  { value: "cancelled", label: "Cancelled", color: "bg-red-100 text-red-800", hoverColor: "hover:bg-red-200" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "not_paid", label: "Not Paid", color: "bg-red-100 text-red-800", hoverColor: "hover:bg-red-200" },
  { value: "paid", label: "Paid", color: "bg-green-100 text-green-800", hoverColor: "hover:bg-green-200" },
  { value: "refunded", label: "Refunded", color: "bg-gray-100 text-gray-800", hoverColor: "hover:bg-gray-200" },
];

const EDITING_STATUS_OPTIONS = [
  { value: "unassigned", label: "Unassigned", color: "bg-gray-100 text-gray-800", hoverColor: "hover:bg-gray-200" },
  { value: "in_editing", label: "In Editing", color: "bg-blue-100 text-blue-800", hoverColor: "hover:bg-blue-200" },
  { value: "with_editor", label: "With Editor", color: "bg-purple-100 text-purple-800", hoverColor: "hover:bg-purple-200" },
  { value: "done_editing", label: "Done Editing", color: "bg-green-100 text-green-800", hoverColor: "hover:bg-green-200" },
];

// Helper to extract Square invoice ID from a URL
function extractSquareInvoiceId(url: string): string | null {
  const match = url.match(/pay-invoice\/([\w:-]+)/i)
  return match ? match[1] : null
}

// Add this after SERVICE_CATALOG
const PACKAGES: Record<string, Record<string, { price: number; includes: string[] }>> = {
  'Essentials Package': {
    '0–999 sq ft': { price: 229.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '1000–1999 sq ft': { price: 289.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '2000–2999 sq ft': { price: 349.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '3000–3999 sq ft': { price: 389.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
    '4000–4999 sq ft': { price: 449.99, includes: ['HDR Photography', '1–2 Drone Shots', 'Slideshow Video Tour', 'Property Website'] },
  },
  'Deluxe Tour Package': {
    '0–999 sq ft': { price: 489.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '1000–1999 sq ft': { price: 579.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '2000–2999 sq ft': { price: 649.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '3000–3999 sq ft': { price: 719.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
    '4000–4999 sq ft': { price: 799.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Slideshow Video Tour', 'Property Website', 'Custom Domain Name'] },
  },
  'Marketing Pro Package': {
    '0–999 sq ft': { price: 829.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '1000–1999 sq ft': { price: 959.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '2000–2999 sq ft': { price: 1079.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '3000–3999 sq ft': { price: 1179.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
    '4000–4999 sq ft': { price: 1299.99, includes: ['HDR Photography', '2–3 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', 'Slideshow Video Tour'] },
  },
  'Premium Seller Experience': {
    '0–999 sq ft': { price: 1069.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '1000–1999 sq ft': { price: 1199.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '2000–2999 sq ft': { price: 1319.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '3000–3999 sq ft': { price: 1419.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
    '4000–4999 sq ft': { price: 1539.99, includes: ['HDR Photography', '3–5 Drone Shots', '360° Virtual Tour', '2D Floor Plan', 'Custom Video', 'Property Website', 'Custom Domain Name', '3D House Model', 'Virtual Twilight', 'Slideshow Video Tour'] },
  },
};

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
  const [customServiceName, setCustomServiceName] = useState("");
  const [customServicePrice, setCustomServicePrice] = useState("");
  const [showCustomService, setShowCustomService] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const { toast } = useToast()
  const [creatingFolders, setCreatingFolders] = useState(false)
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  const fetchBooking = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("bookings")
      .select("id, created_at, property_size, services, total_amount, address, notes, preferred_date, property_status, status, payment_status, editing_status, user_id, agent_name, agent_email, agent_phone, agent_company, raw_photos_link, final_edits_link, tour_360_link, editor_link, delivery_page_link, invoice_link")
      .eq("id", bookingId)
      .single()
    if (error) setError("Failed to load booking.")
    setBooking(data)
    setForm(data)
    setLoading(false)
  }

  useEffect(() => {
    if (bookingId) fetchBooking()
  }, [bookingId])

  useEffect(() => {
    if (!editing || !form) return;
    const size = form.property_size;
    if (!size) return;
    const catalog = getAvailableServices();
    const current = getServicesArray(form.services);
    let updated = false;
    const newServices = current.map((s: Service & { count?: number }) => {
      const match = catalog.find((cat: Service) => cat.name === s.name);
      if (match && s.price !== match.price) {
        updated = true;
        return { ...s, price: match.price };
      }
      return s;
    });
    if (updated) {
      handleChange("services", newServices);
      handleChange("total_amount", recalcTotal(newServices));
    }
    // eslint-disable-next-line
  }, [form?.property_size, editing]);

  const handleChange = (field: string, value: any) => {
    console.log(`Changing ${field} to:`, value)
    setForm((prev: any) => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    let updatedForm = { ...form }
    
    // Ensure all link fields are present in the update, even if empty
    const linkFields = [
      'raw_photos_link',
      'final_edits_link',
      'tour_360_link',
      'editor_link',
      'delivery_page_link',
      'invoice_link',
    ];

    // Clean up the form data before sending
    const cleanedForm = { ...updatedForm };
    linkFields.forEach(field => {
      const val = updatedForm[field];
      // Only clear if the user explicitly deleted it (set to empty string)
      if (val === '') {
        cleanedForm[field] = '';
      }
      // Otherwise, leave as is (even if not a valid link)
    });
    
    // Format time properly for Supabase time column
    if (cleanedForm.time) {
      console.log('Original time value:', cleanedForm.time)
      
      // If time is in HH:mm format, append :00
      if (cleanedForm.time.length === 5) {
        cleanedForm.time = cleanedForm.time + ':00'
      }
      // If time is in HH:mm:ss format, ensure it's valid
      else if (cleanedForm.time.length === 8) {
        // Validate the time format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
        if (!timeRegex.test(cleanedForm.time)) {
          setError("Invalid time format. Please use HH:mm:ss format.")
          setSaving(false)
          return
        }
      }
      
      console.log('Formatted time for Supabase:', cleanedForm.time)
    }

    // Format preferred_date properly for Supabase date column
    if (cleanedForm.preferred_date) {
      console.log('Original date value:', cleanedForm.preferred_date)
      
      // Ensure the date is in ISO format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(cleanedForm.preferred_date)) {
        setError("Invalid date format. Please use YYYY-MM-DD format.")
        setSaving(false)
        return
      }
      
      // Add time component to make it a full ISO datetime
      cleanedForm.preferred_date = `${cleanedForm.preferred_date}T00:00:00`
      console.log('Formatted date for Supabase:', cleanedForm.preferred_date)
    }

    // Log the payload being sent
    console.log('Saving booking with payload:', cleanedForm)

    try {
      // Use the same update endpoint as the main dashboard
      const response = await fetch('/api/bookings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([cleanedForm]), // Wrap in array as the endpoint expects an array
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save changes')
      }

      const { data } = await response.json()
      console.log('Save successful:', data)
      
      if (data && data[0]) {
        // Update local state with the new data
        setBooking(data[0])
        setForm(data[0])
        setEditing(false)
        setSaveSuccess(true)
        setTimeout(() => setSaveSuccess(false), 1200)
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

  // Helper to get services as array
  const getServicesArray = (services: any) => {
    if (!services) return [];
    if (Array.isArray(services)) return services;
    try {
      return JSON.parse(services);
    } catch {
      return [];
    }
  };

  // Helper to recalculate total
  const recalcTotal = (servicesArr: any[]) =>
    servicesArr.reduce((sum, s) => sum + (s.price * (s.count || 1)), 0);

  // Handler to add a service
  const handleAddService = (serviceName: string) => {
    const service = getAvailableServices().find((s: Service) => s.name === serviceName);
    if (!service) return;
    const current = getServicesArray(form.services);
    // If already exists, increment count
    const idx = current.findIndex((s: Service & { count?: number }) => s.name === serviceName);
    let updated;
    if (idx > -1) {
      updated = [...current];
      updated[idx] = { ...updated[idx], count: (updated[idx].count || 1) + 1 };
    } else {
      updated = [{ ...service, count: 1 }, ...current]; // Add new service at the top
    }
    handleChange("services", updated);
    handleChange("total_amount", recalcTotal(updated));
  };

  // Handler to remove a service
  const handleRemoveService = (serviceName: string) => {
    const current = getServicesArray(form.services);
    const idx = current.findIndex((s: Service & { count?: number }) => s.name === serviceName);
    if (idx === -1) return;
    let updated = [...current];
    if ((updated[idx].count || 1) > 1) {
      updated[idx] = { ...updated[idx], count: updated[idx].count - 1 };
    } else {
      updated.splice(idx, 1);
    }
    handleChange("services", updated);
    handleChange("total_amount", recalcTotal(updated));
  };

  // Add increment and decrement handlers
  const handleIncrementService = (serviceName: string) => {
    const current = getServicesArray(form.services);
    const idx = current.findIndex((s: Service & { count?: number }) => s.name === serviceName);
    if (idx === -1) return;
    const updated = [...current];
    updated[idx] = { ...updated[idx], count: (updated[idx].count || 1) + 1 };
    handleChange("services", updated);
    handleChange("total_amount", recalcTotal(updated));
  };

  const handleDecrementService = (serviceName: string) => {
    const current = getServicesArray(form.services);
    const idx = current.findIndex((s: Service & { count?: number }) => s.name === serviceName);
    if (idx === -1) return;
    let updated = [...current];
    if ((updated[idx].count || 1) > 1) {
      updated[idx] = { ...updated[idx], count: updated[idx].count - 1 };
    } else {
      updated.splice(idx, 1);
    }
    handleChange("services", updated);
    handleChange("total_amount", recalcTotal(updated));
  };

  // Helper to get available services based on property_size
  function getAvailableServices(): Service[] {
    // Try to match property_size exactly, fallback to first if not found
    const size = form.property_size || booking?.property_size || '';
    if (SERVICE_CATALOG[size]) return SERVICE_CATALOG[size];
    // Try to match by substring (in case of formatting differences)
    const found = Object.keys(SERVICE_CATALOG).find(key => size.includes(key.split(' ')[0]));
    if (found) return SERVICE_CATALOG[found];
    // Fallback to first
    return SERVICE_CATALOG[Object.keys(SERVICE_CATALOG)[0]];
  }

  const handleAddCustomService = () => {
    if (!customServiceName.trim() || isNaN(Number(customServicePrice))) return;
    const newService = {
      name: customServiceName.trim(),
      price: parseFloat(customServicePrice),
      count: 1,
    };
    const current = getServicesArray(form.services);
    const updated = [newService, ...current];
    handleChange("services", updated);
    handleChange("total_amount", recalcTotal(updated));
    setCustomServiceName("");
    setCustomServicePrice("");
    setShowCustomService(false);
  };

  // Add move up/down handlers
  const handleMoveServiceUp = (index: number) => {
    const current = getServicesArray(form.services);
    if (index <= 0) return;
    const updated = [...current];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    handleChange("services", updated);
    handleChange("total_amount", recalcTotal(updated));
  };

  const handleMoveServiceDown = (index: number) => {
    const current = getServicesArray(form.services);
    if (index >= current.length - 1) return;
    const updated = [...current];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    handleChange("services", updated);
    handleChange("total_amount", recalcTotal(updated));
  };

  // Helper to get address object from form or booking
  function getAddressObj(addr: any) {
    if (!addr) return { street: '', street2: '', city: '', province: '', zipCode: '' };
    if (typeof addr === 'object') return { street: '', street2: '', city: '', province: '', zipCode: '', ...addr };
    try {
      return { street: '', street2: '', city: '', province: '', zipCode: '', ...JSON.parse(addr) };
    } catch {
      return { street: '', street2: '', city: '', province: '', zipCode: '' };
    }
  }

  const createProjectFolders = async () => {
    setCreatingFolders(true)
    try {
      console.log('Starting createProjectFolders with data:', {
        bookingId,
        propertyAddress: form.address,
        agentName: form.agent_name,
      })

      // First, test if the API is working
      console.log('Testing API endpoint with /api/test')
      const testResponse = await fetch('/api/test')
      console.log('Test response status:', testResponse.status)
      
      const testResponseText = await testResponse.text()
      console.log('Test response text:', testResponseText)
      
      let testData
      try {
        testData = JSON.parse(testResponseText)
        console.log('Test API response:', testData)
      } catch (e) {
        console.error('Could not parse test response as JSON:', e)
      }

      // Step 1: Create Dropbox folders
      console.log('Making request to /api/dropbox/create-folders')
      const response = await fetch('/api/dropbox/create-folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId,
          propertyAddress: form.address,
          agentName: form.agent_name,
        }),
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', Object.fromEntries(response.headers.entries()))

      // Get the response as text first
      const responseText = await response.text()
      console.log('Response text:', responseText)
      
      // Try to parse as JSON
      let responseData
      try {
        responseData = JSON.parse(responseText)
        console.log('Response data:', responseData)
      } catch (error) {
        console.error('Error parsing response as JSON:', error)
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}...`)
      }

      if (!response.ok) {
        console.error('Error response from server:', responseData)
        const err = new Error(responseData.error || 'Failed to create project folders');
        if (responseData.details) (err as any).details = responseData.details;
        throw err;
      }

      // Destructure the correct link names from the API response
      const { rawPhotosLink, editedMediaLink, finalMediaLink } = responseData
      console.log('Received links:', { rawPhotosLink, editedMediaLink, finalMediaLink })
      
      // Update form state with new links
      const updatedForm = {
        ...form,
        raw_photos_link: rawPhotosLink,
        final_edits_link: editedMediaLink,
        delivery_page_link: finalMediaLink,
      };
      
      // Save the updated links to the database
      console.log('Saving updated links to database...');
      const saveResponse = await fetch('/api/bookings/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([updatedForm]),
      });

      if (!saveResponse.ok) {
        const error = await saveResponse.json();
        throw new Error(error.error || 'Failed to save links to database');
      }

      const { data: savedData } = await saveResponse.json();
      console.log('Links saved successfully:', savedData);

      // Update local state with saved data
      setForm(savedData[0]);
      setBooking(savedData[0]);

      // Fetch the latest booking data to ensure everything is in sync
      await fetchBooking();

      toast({
        title: "Success",
        description: "Project folders created and links saved successfully",
      })
    } catch (error: any) {
      console.error('Error in createProjectFolders:', error)
      console.error('Error details:', {
        name: error?.name,
        message: error?.message,
        stack: error?.stack,
      })
      
      // Check if the error is likely due to Dropbox authentication issues
      const errorMessage = (error?.message || '').toLowerCase()
      const errorDetails = (error?.details || '').toLowerCase()
      const isDropboxAuthError = 
        errorMessage.includes('unauthorized') || 
        errorMessage.includes('access token') || 
        errorMessage.includes('authentication') || 
        errorMessage.includes('forbidden') ||
        errorMessage.includes('401') ||
        errorMessage.includes('403') ||
        errorDetails.includes('access token') ||
        errorDetails.includes('authentication') ||
        errorDetails.includes('unauthorized') ||
        errorDetails.includes('forbidden') ||
        errorDetails.includes('401') ||
        errorDetails.includes('403')

      if (isDropboxAuthError) {
        toast({
          title: "Dropbox Authentication Required",
          description: "Redirecting to Dropbox authentication...",
          variant: "default",
        })
        // Redirect to Dropbox auth page after a short delay
        setTimeout(() => {
          router.push('/dropbox-auth')
        }, 500)
      } else {
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to create project folders or save links",
          variant: "destructive",
        })
      }
    } finally {
      setCreatingFolders(false)
    }
  }

  const handleEmailSent = async () => {
    // Refresh booking data to update delivery_email_sent status
    await fetchBooking()
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Booking Details</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setIsEmailModalOpen(true)}
                className="bg-black text-white hover:bg-gray-900 p-2"
                size="icon"
              >
                <Mail className="w-4 h-4" />
              </Button>
              {editing ? (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-green-600 text-white hover:bg-green-700"
                >
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  Edit Booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" onClick={() => router.back()} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {error && <div className="mb-4 text-red-600">{error}</div>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Client Information */}
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4">Client Information</h2>
            <div className="mb-2"><span className="text-xs text-gray-500 block">Full Name</span>
              {editing ? (
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={form.agent_name || ''}
                  onChange={e => handleChange('agent_name', e.target.value)}
                />
              ) : (
                booking.agent_name
              )}
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500 block">Email</span>
              {editing ? (
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  type="email"
                  value={form.agent_email || ''}
                  onChange={e => handleChange('agent_email', e.target.value)}
                />
              ) : (
                <div className="flex items-center gap-2 group">
                  <span className="text-sm">{booking.agent_email}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => copyToClipboard(booking.agent_email)}
                  >
                    {copiedEmail ? (
                      <CheckCheck className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className="mb-2"><span className="text-xs text-gray-500 block">Phone</span>
              {editing ? (
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  type="tel"
                  value={form.agent_phone || ''}
                  onChange={e => handleChange('agent_phone', e.target.value)}
                />
              ) : (
                booking.agent_phone
              )}
            </div>
            <div className="mb-2"><span className="text-xs text-gray-500 block">Company</span>
              {editing ? (
                <input
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={form.agent_company || ''}
                  onChange={e => handleChange('agent_company', e.target.value)}
                />
              ) : (
                booking.agent_company || 'N/A'
              )}
            </div>
          </div>
          {/* Property Information */}
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4">Property Information</h2>
            <div className="mb-2">
              <span className="text-xs text-gray-500 block">Full Address</span>
              {editing ? (
                (() => {
                  const address = getAddressObj(form.address);
                  return (
                    <div className="grid grid-cols-1 gap-2">
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Street Address"
                        value={address.street}
                        onChange={e => handleChange('address', { ...address, street: e.target.value })}
                      />
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Apt, Suite, etc. (optional)"
                        value={address.street2 || ''}
                        onChange={e => handleChange('address', { ...address, street2: e.target.value })}
                      />
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="City"
                        value={address.city}
                        onChange={e => handleChange('address', { ...address, city: e.target.value })}
                      />
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Province"
                        value={address.province}
                        onChange={e => handleChange('address', { ...address, province: e.target.value })}
                      />
                      <input
                        className="border rounded px-2 py-1 text-sm"
                        placeholder="Zip/Postal Code"
                        value={address.zipCode}
                        onChange={e => handleChange('address', { ...address, zipCode: e.target.value })}
                      />
                    </div>
                  );
                })()
              ) : (
                (() => {
                  // Ensure booking is checked, though the parent component's loading state should handle it.
                  const addr = booking?.address; 
                  let displayAddress: string = "Address not available";
                  let mapLink: string = "#";

                  if (addr) {
                    if (typeof addr === "string" && addr.trim() !== "") {
                      displayAddress = addr.trim();
                      mapLink = getGoogleMapsLink(addr);
                    } else if (typeof addr === "object" && addr !== null && (addr as PageAddress).street) {
                      const currentAddr = addr as PageAddress;
                      const street = String(currentAddr.street || "").trim();
                      const street2 = String(currentAddr.street2 || "").trim();
                      const city = String(currentAddr.city || "").trim();
                      const province = String(currentAddr.province || "").trim();
                      const zipCode = String(currentAddr.zipCode || "").trim();
                      
                      let parts = [street, street2, city, province, zipCode];
                      let assembledAddress = parts.filter(part => part !== "").join(", ");
                      
                      displayAddress = assembledAddress.trim() || "Address details incomplete";
                      if (displayAddress === "," || !street) { // If only commas or street is missing, consider it incomplete
                         displayAddress = "Address details incomplete";
                      }
                      mapLink = getGoogleMapsLink(currentAddr);
                    } else if (typeof addr === "object" && addr !== null) {
                       // Object but no street or not conforming
                       displayAddress = "Address details incomplete (Invalid Format)";
                       // Try to create a map link if any parts are stringifiable
                       mapLink = getGoogleMapsLink(Object.values(addr).filter(v => typeof v === 'string').join(', '));

                    }
                  }
                  if (displayAddress.trim() === "" || displayAddress.trim() === ",") displayAddress = "Address not available";

                  return (
                    <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {displayAddress}
                    </a>
                  );
                })()
              )}
            </div>
            <div className="mb-2"><span className="text-xs text-gray-500 block">Property Size</span>
              {editing ? (
                <select
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={form.property_size || ''}
                  onChange={e => handleChange('property_size', e.target.value)}
                >
                  <option value="" disabled>Select property size...</option>
                  {PROPERTY_SIZE_OPTIONS.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              ) : (
                booking.property_size
              )}
            </div>
            <div className="mb-2"><span className="text-xs text-gray-500 block">Occupancy Status</span>
              {editing ? (
                <select
                  className="border rounded px-2 py-1 text-sm w-full"
                  value={form.property_status || ''}
                  onChange={e => handleChange('property_status', e.target.value)}
                >
                  <option value="" disabled>Select occupancy status...</option>
                  {OCCUPANCY_STATUS_OPTIONS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              ) : (
                booking.property_status
              )}
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500 block">Notes</span>
              {editing ? (
                <textarea
                  className="border rounded px-2 py-1 text-sm w-full min-h-[60px]"
                  value={form.notes || ""}
                  onChange={e => handleChange("notes", e.target.value)}
                  placeholder="Enter notes..."
                />
              ) : (
                <span className="text-sm bg-gray-50 p-2 rounded block">{booking.notes || "No notes available"}</span>
              )}
            </div>
          </div>
          {/* Booking Metadata */}
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4">Booking Metadata</h2>
            <div className="mb-2">
              <span className="text-xs text-gray-500 block">Preferred Date</span>
              {editing ? (
                <input
                  type="date"
                  className="border rounded px-2 py-1 text-sm"
                  value={form.preferred_date ? form.preferred_date.split('T')[0] : ""}
                  onChange={e => {
                    console.log('Date input changed:', e.target.value)
                    handleChange("preferred_date", e.target.value)
                  }}
                />
              ) : (
                format(new Date(booking.preferred_date + 'T12:00:00'), "MMMM d, yyyy")
              )}
            </div>
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
                (() => {
                  if (!booking.time || typeof booking.time !== "string" || !/^\d{2}:\d{2}(:\d{2})?$/.test(booking.time)) {
                    return "N/A";
                  }
                  try {
                    return format(parse(booking.time, "HH:mm:ss", new Date()), "h:mm a");
                  } catch {
                    return "N/A";
                  }
                })()
              )}
            </div>
            <div className="mb-2"><span className="text-xs text-gray-500 block">Created</span>{booking.created_at}</div>
            <div className="mb-2">
              <span className="text-xs text-gray-500 block">Payment Status</span>
              {editing ? (
                <Select
                  value={form.payment_status || ''}
                  onValueChange={value => handleChange('payment_status', value)}
                >
                  <SelectTrigger className={`w-[130px] border-0 focus:ring-0 ${
                    PAYMENT_STATUS_OPTIONS.find(opt => opt.value === (form.payment_status || ''))?.color
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PAYMENT_STATUS_OPTIONS.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className={`${option.color} ${option.hoverColor} focus:bg-opacity-100 data-[highlighted]:bg-opacity-100`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  PAYMENT_STATUS_OPTIONS.find(opt => opt.value === (form.payment_status || ''))?.color
                }`}>
                  {PAYMENT_STATUS_OPTIONS.find(opt => opt.value === (form.payment_status || ''))?.label || 'N/A'}
                </span>
              )}
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500 block">Job Status</span>
              {editing ? (
                <Select
                  value={form.status || ''}
                  onValueChange={value => handleChange('status', value)}
                >
                  <SelectTrigger className={`w-[130px] border-0 focus:ring-0 ${
                    STATUS_OPTIONS.find(opt => opt.value === (form.status || ''))?.color
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className={`${option.color} ${option.hoverColor} focus:bg-opacity-100 data-[highlighted]:bg-opacity-100`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  STATUS_OPTIONS.find(opt => opt.value === (form.status || ''))?.color
                }`}>
                  {STATUS_OPTIONS.find(opt => opt.value === (form.status || ''))?.label || 'N/A'}
                </span>
              )}
            </div>
            <div className="mb-2">
              <span className="text-xs text-gray-500 block">Editing Status</span>
              {editing ? (
                <Select
                  value={form.editing_status || ''}
                  onValueChange={value => handleChange('editing_status', value)}
                >
                  <SelectTrigger className={`w-[130px] border-0 focus:ring-0 ${
                    EDITING_STATUS_OPTIONS.find(opt => opt.value === (form.editing_status || ''))?.color
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {EDITING_STATUS_OPTIONS.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                        className={`${option.color} ${option.hoverColor} focus:bg-opacity-100 data-[highlighted]:bg-opacity-100`}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  EDITING_STATUS_OPTIONS.find(opt => opt.value === (form.editing_status || ''))?.color
                }`}>
                  {EDITING_STATUS_OPTIONS.find(opt => opt.value === (form.editing_status || ''))?.label || 'N/A'}
                </span>
              )}
            </div>
          </div>
          {/* Services Booked */}
          <div className="bg-white rounded-lg p-6 border">
            <h2 className="text-lg font-semibold mb-4">Services Booked</h2>
            {(() => {
              // Detect all packages in the services array
              const packageNames = Object.keys(PACKAGES);
              const propertySize = booking.property_size;
              const servicesArr = Array.isArray(booking.services) ? booking.services : getServicesArray(booking.services);
              // Find all package services
              const packageServices = servicesArr.filter((s: any) => packageNames.includes(s.name));
              // Collect all included services from all packages
              let allPackageIncludes: string[] = [];
              let total = 0;
              packageServices.forEach((pkg: any) => {
                const pkgInfo = PACKAGES[pkg.name]?.[propertySize];
                if (pkgInfo) {
                  allPackageIncludes = allPackageIncludes.concat(pkgInfo.includes);
                  total += pkgInfo.price;
                }
              });
              // Find all a la carte services (not a package)
              // Only show a la carte services NOT included in any package
              const aLaCarteServices = servicesArr.filter((s: any) => !packageNames.includes(s.name) && !allPackageIncludes.includes(s.name));
              aLaCarteServices.forEach((s: any) => {
                total += (s.price * (s.count || 1));
              });
              return (
                <>
                  {packageServices.length > 0 && (
                    <div className="mb-4 space-y-6">
                      {packageServices.map((pkg: any, idx: number) => {
                        const pkgInfo = PACKAGES[pkg.name]?.[propertySize];
                        if (!pkgInfo) return null;
                        return (
                          <div key={pkg.name + idx} className="border-b pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                            <div className="font-bold text-blue-700 text-lg">{pkg.name} <span className="text-gray-500 font-normal">({propertySize})</span></div>
                            <div className="text-md font-semibold mb-1">Package Price: ${pkgInfo.price.toFixed(2)}</div>
                            <div className="text-sm text-gray-700 mb-2">Includes:</div>
                            <ul className="list-disc list-inside mb-2">
                              {pkgInfo.includes.map((inc, i) => (
                                <li key={i}>{inc}</li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {aLaCarteServices.length > 0 && (
                    <div>
                      <div className="text-md font-semibold mb-1">Additional A La Carte Services:</div>
                      <ul className="space-y-1">
                        {aLaCarteServices.map((s: any, i: number) => (
                          <li key={i} className="flex justify-between items-center">
                            <span>{s.name}{s.count && s.count > 1 ? ` (x${s.count})` : ""}</span>
                            <span>${(s.price * (s.count || 1)).toFixed(2)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="mt-4 font-bold">
                    Total: ${total.toFixed(2)}
                  </div>
                </>
              );
            })()}
          </div>
          {/* Media Files */}
          <div className="bg-white rounded-lg p-6 border w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <span>Media Files</span>
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={createProjectFolders}
                disabled={creatingFolders || !form.address || form.raw_photos_link}
                className="flex items-center gap-2"
              >
                {creatingFolders ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FolderPlus className="h-4 w-4" />
                )}
                {form.raw_photos_link ? "Project Files Created" : "Create Project Files"}
              </Button>
            </div>
            <div className="space-y-6">
              {/* Raw Photo Folder */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <span className="flex items-center gap-2 min-w-[160px] font-medium text-gray-700">
                  <span className="text-xl">📁</span> Raw Brackets
                </span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                  {editing ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      className="border rounded px-2 py-1 text-sm w-full md:w-auto"
                      placeholder="Paste Google Drive/Dropbox link..."
                      value={form.raw_photos_link || ''}
                      onChange={e => handleChange('raw_photos_link', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                      />
                      {form.raw_photos_link && (
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          const newForm = { ...form };
                          newForm.raw_photos_link = '';
                          setForm(newForm);
                          handleSave();
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    form.raw_photos_link ? (
                      <div className="flex items-center gap-2">
                      <TruncatedLink href={form.raw_photos_link}>
                          {getShortLink(form.raw_photos_link)}
                      </TruncatedLink>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          let newForm;
                          if (!editing) {
                            setEditing(true);
                            newForm = { ...form };
                            newForm.raw_photos_link = '';
                            setForm(newForm);
                          } else {
                            newForm = { ...form };
                            newForm.raw_photos_link = '';
                            setForm(newForm);
                            handleSave();
                          }
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-400 italic cursor-pointer hover:text-gray-600" 
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        No link added yet
                      </span>
                    )
                  )}
                  <Button
                    size="sm"
                    className="w-full md:w-auto"
                    variant="outline"
                    onClick={() => form.raw_photos_link && window.open(form.raw_photos_link, '_blank')}
                    disabled={!form.raw_photos_link}
                  >
                    Open Folder
                  </Button>
                </div>
              </div>
              {/* Final Edited Media Folder */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <span className="flex items-center gap-2 min-w-[160px] font-medium text-gray-700">
                  <span className="text-xl">🎞️</span> Edited Media
                </span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                  {editing ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      className="border rounded px-2 py-1 text-sm w-full md:w-auto"
                      placeholder="Paste Google Drive/Dropbox link..."
                      value={form.final_edits_link || ''}
                      onChange={e => handleChange('final_edits_link', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                      />
                      {form.final_edits_link && (
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          const newForm = { ...form };
                          newForm.final_edits_link = '';
                          setForm(newForm);
                          handleSave();
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    form.final_edits_link ? (
                      <div className="flex items-center gap-2">
                      <TruncatedLink href={form.final_edits_link}>
                          {getShortLink(form.final_edits_link)}
                      </TruncatedLink>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          let newForm;
                          if (!editing) {
                            setEditing(true);
                            newForm = { ...form };
                            newForm.final_edits_link = '';
                            setForm(newForm);
                          } else {
                            newForm = { ...form };
                            newForm.final_edits_link = '';
                            setForm(newForm);
                            handleSave();
                          }
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-400 italic cursor-pointer hover:text-gray-600" 
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        No link added yet
                      </span>
                    )
                  )}
                  <Button
                    size="sm"
                    className="w-full md:w-auto"
                    variant="outline"
                    onClick={() => form.final_edits_link && window.open(form.final_edits_link, '_blank')}
                    disabled={!form.final_edits_link}
                  >
                    Open Folder
                  </Button>
                </div>
              </div>
              {/* 360 Tour Link */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <span className="flex items-center gap-2 min-w-[160px] font-medium text-gray-700">
                  <span className="text-xl">🌏</span> 360 Tour Link
                </span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                  {editing ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      className="border rounded px-2 py-1 text-sm w-full md:w-auto"
                      placeholder="Paste 360 tour link..."
                      value={form.tour_360_link || ''}
                      onChange={e => handleChange('tour_360_link', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                      />
                      {form.tour_360_link && (
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          const newForm = { ...form };
                          newForm.tour_360_link = '';
                          setForm(newForm);
                          handleSave();
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    form.tour_360_link ? (
                      <div className="flex items-center gap-2">
                      <TruncatedLink href={form.tour_360_link}>
                          {getShortLink(form.tour_360_link)}
                      </TruncatedLink>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          let newForm;
                          if (!editing) {
                            setEditing(true);
                            newForm = { ...form };
                            newForm.tour_360_link = '';
                            setForm(newForm);
                          } else {
                            newForm = { ...form };
                            newForm.tour_360_link = '';
                            setForm(newForm);
                            handleSave();
                          }
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-400 italic cursor-pointer hover:text-gray-600" 
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        No link added yet
                      </span>
                    )
                  )}
                  <Button
                    size="sm"
                    className="w-full md:w-auto"
                    variant="outline"
                    onClick={() => form.tour_360_link && window.open(form.tour_360_link, '_blank')}
                    disabled={!form.tour_360_link}
                  >
                    View 360 Tour
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Management Links */}
          <div className="bg-white rounded-lg p-6 border w-full">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>Management Links</span>
            </h2>
            <div className="space-y-6">
              {/* Editor Link */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <span className="flex items-center gap-2 min-w-[160px] font-medium text-gray-700">
                  <span className="text-xl">✏️</span> Editor Link
                </span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                  {editing ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      className="border rounded px-2 py-1 text-sm w-full md:w-auto"
                      placeholder="Paste editor link..."
                      value={form.editor_link || ''}
                      onChange={e => handleChange('editor_link', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                      />
                      {form.editor_link && (
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          const newForm = { ...form };
                          newForm.editor_link = '';
                          setForm(newForm);
                          handleSave();
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    form.editor_link ? (
                      <div className="flex items-center gap-2">
                      <TruncatedLink href={form.editor_link}>
                          {getShortLink(form.editor_link)}
                      </TruncatedLink>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          let newForm;
                          if (!editing) {
                            setEditing(true);
                            newForm = { ...form };
                            newForm.editor_link = '';
                            setForm(newForm);
                          } else {
                            newForm = { ...form };
                            newForm.editor_link = '';
                            setForm(newForm);
                            handleSave();
                          }
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-400 italic cursor-pointer hover:text-gray-600" 
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        No link added yet
                      </span>
                    )
                  )}
                  <Button
                    size="sm"
                    className="w-full md:w-auto"
                    variant="outline"
                    onClick={() => window.open(form.editor_link || "https://app.pixlmob.com/maidanghung", '_blank')}
                    disabled={false}
                  >
                    Open Editor
                  </Button>
                </div>
              </div>
              {/* Client Delivery Page */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <span className="flex items-center gap-2 min-w-[160px] font-medium text-gray-700">
                  <span className="text-xl">🌐</span> Final Media (Client Delivery)
                </span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                  {editing ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      className="border rounded px-2 py-1 text-sm w-full md:w-auto"
                      placeholder="Paste delivery page link..."
                      value={form.delivery_page_link || ''}
                      onChange={e => handleChange('delivery_page_link', e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                      />
                      {form.delivery_page_link && (
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          const newForm = { ...form };
                          newForm.delivery_page_link = '';
                          setForm(newForm);
                          handleSave();
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    form.delivery_page_link ? (
                      <div className="flex items-center gap-2">
                      <TruncatedLink href={form.delivery_page_link}>
                          {getShortLink(form.delivery_page_link)}
                      </TruncatedLink>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          let newForm;
                          if (!editing) {
                            setEditing(true);
                            newForm = { ...form };
                            newForm.delivery_page_link = '';
                            setForm(newForm);
                          } else {
                            newForm = { ...form };
                            newForm.delivery_page_link = '';
                            setForm(newForm);
                            handleSave();
                          }
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-400 italic cursor-pointer hover:text-gray-600" 
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        No link added yet
                      </span>
                    )
                  )}
                  <Button
                    size="sm"
                    className="w-full md:w-auto"
                    variant="outline"
                    onClick={() => form.delivery_page_link && window.open(form.delivery_page_link, '_blank')}
                    disabled={!form.delivery_page_link}
                  >
                    Open Folder
                  </Button>
                </div>
              </div>
              {/* Invoice Link */}
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 gap-2">
                <span className="flex items-center gap-2 min-w-[160px] font-medium text-gray-700">
                  <span className="text-xl">📄</span> Invoice Link
                </span>
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2">
                  {editing ? (
                    <div className="flex items-center gap-2 w-full md:w-auto">
                    <input
                      className="border rounded px-2 py-1 text-sm w-full md:w-auto"
                      placeholder="Paste invoice link..."
                      value={form.invoice_link || ''}
                        onChange={e => {
                          const link = e.target.value;
                          handleChange('invoice_link', link);
                          const invoiceId = extractSquareInvoiceId(link);
                          if (invoiceId) handleChange('invoice_id', invoiceId);
                        }}
                        onKeyDown={e => { if (e.key === 'Enter') handleSave(); }}
                      />
                      {form.invoice_link && (
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          const newForm = { ...form };
                          newForm.invoice_link = '';
                          setForm(newForm);
                          handleSave();
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    form.invoice_link ? (
                      <div className="flex items-center gap-2">
                      <TruncatedLink href={form.invoice_link}>
                          {getShortLink(form.invoice_link)}
                      </TruncatedLink>
                        <Button size="icon" variant="ghost" className="text-red-500" onClick={() => {
                          let newForm;
                          if (!editing) {
                            setEditing(true);
                            newForm = { ...form };
                            newForm.invoice_link = '';
                            setForm(newForm);
                          } else {
                            newForm = { ...form };
                            newForm.invoice_link = '';
                            setForm(newForm);
                            handleSave();
                          }
                        }}>
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <span 
                        className="text-gray-400 italic cursor-pointer hover:text-gray-600" 
                        onClick={() => {
                          setEditing(true);
                        }}
                      >
                        No link added yet
                      </span>
                    )
                  )}
                  <Button
                    size="sm"
                    className="w-full md:w-auto"
                    variant="outline"
                    onClick={() => form.invoice_link && window.open(form.invoice_link, '_blank')}
                    disabled={!form.invoice_link}
                  >
                    View Invoice
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add the email modal */}
      <CreateEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        booking={booking}
        onEmailSent={handleEmailSent}
      />
    </div>
  )
} 