// @ts-ignore
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
// @ts-ignore
import { Resend } from "https://esm.sh/resend@3.2.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS, GET",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

// Email configuration - using verified domain rephotosteam.com for sending only
const EMAIL_CONFIG = {
  from: "RePhotos <noreply@rephotosteam.com>", // Using verified domain for sending
  replyTo: "cooper@rephotos.ca", // Keep original email
  companyName: "Rephotos",
  phone: "905-299-9300"
};

// Add version logging
console.log("Booking Confirmation Function version: 2.0.0");
console.log("Function started at:", new Date().toISOString());

// Check if API key exists and log its presence (but not the actual key)
// @ts-ignore
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
console.log("Environment check:", {
  hasResendKey: !!RESEND_API_KEY,
  resendKeyLength: RESEND_API_KEY?.length || 0,
  resendKeyPrefix: RESEND_API_KEY?.substring(0, 5) + "...",
  // @ts-ignore
  denoVersion: Deno.version,
  emailFrom: EMAIL_CONFIG.from
});

if (!RESEND_API_KEY) {
  console.error("RESEND_API_KEY is not set in environment variables!");
  throw new Error("RESEND_API_KEY is not configured");
}

// Initialize Resend client
let resend: Resend;
try {
  console.log("Initializing Resend client...");
  resend = new Resend(RESEND_API_KEY);
  console.log("Resend client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Resend client:", error);
  throw error;
}

// Updated package definitions based on new CSV pricing
const PACKAGES: Record<string, Record<string, { price: number; includes: string[] }>> = {
  'Essentials': {
    'Under 1500 sq.ft.': { 
      price: 279, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '1500-2500 sq.ft.': { 
      price: 329, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '2500-3500 sq.ft.': { 
      price: 379, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '3500-4500 sq.ft.': { 
      price: 429, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
    '4500-5500 sq.ft.': { 
      price: 479, 
      includes: ['Professional Photography', '1-2 Drone Photos', 'Listing Website', 'Slideshow Video', 'Feature Sheet (PDF)', 'Social Media Post (Square)', 'Social Media Story (Vertical)', 'Blue Sky Replacement'] 
    },
  },
  'Essentials + 2D Floor Plans': {
    'Under 1500 sq.ft.': { 
      price: 349, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '1500-2500 sq.ft.': { 
      price: 399, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '2500-3500 sq.ft.': { 
      price: 449, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '3500-4500 sq.ft.': { 
      price: 499, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
    '4500-5500 sq.ft.': { 
      price: 549, 
      includes: ['Everything in Essentials + 2D Floor Plan (Color-coded + Black and white)'] 
    },
  },
  'Essentials + Matterport Tour': {
    'Under 1500 sq.ft.': { 
      price: 399, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '1500-2500 sq.ft.': { 
      price: 449, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '2500-3500 sq.ft.': { 
      price: 499, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '3500-4500 sq.ft.': { 
      price: 549, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
    '4500-5500 sq.ft.': { 
      price: 599, 
      includes: ['Everything in Essentials + 360 Virtual Tour'] 
    },
  },
  'Essentials + Property Tour Video': {
    'Under 1500 sq.ft.': { 
      price: 479, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '1500-2500 sq.ft.': { 
      price: 529, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '2500-3500 sq.ft.': { 
      price: 579, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '3500-4500 sq.ft.': { 
      price: 629, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
    '4500-5500 sq.ft.': { 
      price: 679, 
      includes: ['Everything in Essentials + Property Tour Video (Drone Footage)'] 
    },
  },
  'Marketing Pro': {
    'Under 1500 sq.ft.': { 
      price: 679, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '1500-2500 sq.ft.': { 
      price: 729, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '2500-3500 sq.ft.': { 
      price: 779, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '3500-4500 sq.ft.': { 
      price: 829, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
    '4500-5500 sq.ft.': { 
      price: 879, 
      includes: ['Everything in Essentials + Enhanced Twilight Listing Image + 360 Virtual Tour', 'Property Highlights Video', '2D Floor Plan (Color-coded + Blk and white)', 'Full Aerial Coverage (Additional Drone Images + Footage) + Custom Domain Name'] 
    },
  },
  'Top Agent': {
    'Under 1500 sq.ft.': { 
      price: 799, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '1500-2500 sq.ft.': { 
      price: 849, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '2500-3500 sq.ft.': { 
      price: 899, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '3500-4500 sq.ft.': { 
      price: 949, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
    '4500-5500 sq.ft.': { 
      price: 999, 
      includes: ['Everything in Marketing Pro + Agent on video', '2 Additional Twilight Images', 'Social Media Reel Video', 'Extra social media content', '2D + 3D Floor Plan'] 
    },
  },
};

// Individual service pricing
const INDIVIDUAL_SERVICES: Record<string, Record<string, number>> = {
  'HDR Photography': {
    'Under 1500 sq.ft.': 169,
    '1500-2500 sq.ft.': 229,
    '2500-3500 sq.ft.': 289,
    '3500-4500 sq.ft.': 349,
    '4500-5500 sq.ft.': 409,
  },
  'Matterport 3D Tour': {
    'Under 1500 sq.ft.': 199,
    '1500-2500 sq.ft.': 239,
    '2500-3500 sq.ft.': 279,
    '3500-4500 sq.ft.': 319,
    '4500-5500 sq.ft.': 359,
  },
  'Property Highlights Video': {
    'Under 1500 sq.ft.': 289,
    '1500-2500 sq.ft.': 309,
    '2500-3500 sq.ft.': 329,
    '3500-4500 sq.ft.': 349,
    '4500-5500 sq.ft.': 369,
  },
  'Slideshow Video Tour': {
    'Under 1500 sq.ft.': 99,
    '1500-2500 sq.ft.': 99,
    '2500-3500 sq.ft.': 99,
    '3500-4500 sq.ft.': 99,
    '4500-5500 sq.ft.': 99,
  },
  'Social Media Reel': {
    'Under 1500 sq.ft.': 229,
    '1500-2500 sq.ft.': 249,
    '2500-3500 sq.ft.': 269,
    '3500-4500 sq.ft.': 289,
    '4500-5500 sq.ft.': 309,
  },
  'Drone Aerial Photos': {
    'Under 1500 sq.ft.': 159,
    '1500-2500 sq.ft.': 159,
    '2500-3500 sq.ft.': 159,
    '3500-4500 sq.ft.': 159,
    '4500-5500 sq.ft.': 159,
  },
  'Drone Aerial Video': {
    'Under 1500 sq.ft.': 159,
    '1500-2500 sq.ft.': 159,
    '2500-3500 sq.ft.': 159,
    '3500-4500 sq.ft.': 159,
    '4500-5500 sq.ft.': 159,
  },
  'Drone Photos + Video': {
    'Under 1500 sq.ft.': 199,
    '1500-2500 sq.ft.': 199,
    '2500-3500 sq.ft.': 199,
    '3500-4500 sq.ft.': 199,
    '4500-5500 sq.ft.': 199,
  },
  '2D Floor Plans': {
    'Under 1500 sq.ft.': 119,
    '1500-2500 sq.ft.': 149,
    '2500-3500 sq.ft.': 179,
    '3500-4500 sq.ft.': 209,
    '4500-5500 sq.ft.': 239,
  },
  '3D House Model': {
    'Under 1500 sq.ft.': 159,
    '1500-2500 sq.ft.': 199,
    '2500-3500 sq.ft.': 239,
    '3500-4500 sq.ft.': 279,
    '4500-5500 sq.ft.': 319,
  },
  'Property Website': {
    'Under 1500 sq.ft.': 129,
    '1500-2500 sq.ft.': 129,
    '2500-3500 sq.ft.': 129,
    '3500-4500 sq.ft.': 129,
    '4500-5500 sq.ft.': 129,
  },
  'Custom Domain Name': {
    'Under 1500 sq.ft.': 39,
    '1500-2500 sq.ft.': 39,
    '2500-3500 sq.ft.': 39,
    '3500-4500 sq.ft.': 39,
    '4500-5500 sq.ft.': 39,
  },
};

// Per-image services (fixed pricing)
const PER_IMAGE_SERVICES: Record<string, number> = {
  'Virtual Declutter': 29,
  'Virtual Staging': 39,
  'Virtual Twilight': 49,
};

// Helper function to convert specific property size to range for pricing
function getPropertySizeRange(size: string | number): string {
  let sizeNum: number;
  
  // If it's already a range format, return it if it matches our new format
  if (typeof size === 'string' && size.includes('sq.ft.')) {
    return size;
  }
  
  // Convert to number
  if (typeof size === 'string') {
    sizeNum = parseInt(size.replace(/[^0-9]/g, ''));
  } else {
    sizeNum = size;
  }
  
  // Convert number to appropriate range using updated ranges
  if (sizeNum < 1500) return 'Under 1500 sq.ft.';
  if (sizeNum < 2500) return '1500-2500 sq.ft.';
  if (sizeNum < 3500) return '2500-3500 sq.ft.';
  if (sizeNum < 4500) return '3500-4500 sq.ft.';
  return '4500-5500 sq.ft.';
}

// Helper function to format property size for display
function formatPropertySizeDisplay(size: string | number): string {
  if (!size) return 'Not specified';
  
  if (typeof size === 'string') {
    return size;
  }
  
  return `${size.toLocaleString()} sq ft`;
}

// Helper function to validate booking record
function validateBookingRecord(record: any) {
  const requiredFields = [
    'property_size',
    'services',
    'total_amount',
    'address',
    'preferred_date',
    'time',
    'agent_name',
    'agent_email'
  ];

  const missingFields = requiredFields.filter((field) => !record[field]);
  if (missingFields.length > 0) {
    throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
  }

  if (!Array.isArray(record.services) || record.services.length === 0) {
    throw new Error('Services must be a non-empty array');
  }

  if (typeof record.address !== 'object' && typeof record.address !== 'string') {
    throw new Error('Address must be an object or string');
  }

  if (typeof record.address === 'object') {
    const requiredAddressFields = ['street', 'city', 'province', 'zipCode'];
    const missingAddressFields = requiredAddressFields.filter((field) => !record.address[field]);
    if (missingAddressFields.length > 0) {
      throw new Error(`Missing required address fields: ${missingAddressFields.join(', ')}`);
    }
  }

  return true;
}

// Helper function to send email
async function sendEmail(to: string | string[], subject: string, text: string) {
  try {
    console.log("Attempting to send email:", {
      from: EMAIL_CONFIG.from,
      to,
      subject,
      textLength: text.length
    });

    const response = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      reply_to: EMAIL_CONFIG.replyTo,
      to,
      subject,
      text
    });

    console.log("Email send response:", {
      success: !response.error,
      error: response.error,
      id: response.id
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error sending email:", {
        error: error.message,
        stack: error.stack,
        cause: (error as any).cause,
        from: EMAIL_CONFIG.from
      });
      throw error;
    } else {
      console.error("Unknown error sending email:", error);
      throw new Error("Unknown error sending email");
    }
  }
}

serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Booking confirmation function called at:`, new Date().toISOString());
  console.log(`[${requestId}] Request URL:`, req.url);
  console.log(`[${requestId}] Request method:`, req.method);
  console.log(`[${requestId}] Request headers:`, Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }

  // Add a test endpoint that works with GET requests
  if (req.url.endsWith('/test')) {
    // Allow GET requests for testing
    if (req.method === "GET") {
      try {
        console.log(`[${requestId}] Testing email sending via GET request...`);
        const testResponse = await sendEmail(
          ["cooper@rephotosteam.com"],
          "Test Email from Booking Confirmation Edge Function",
          `This is a test email to verify the booking confirmation function is working.\n\nFrom: ${EMAIL_CONFIG.from}\nReply-To: ${EMAIL_CONFIG.replyTo}\nCompany: ${EMAIL_CONFIG.companyName}`
        );

        return new Response(JSON.stringify({
          message: "Test email sent successfully",
          testResponse,
          requestId,
          timestamp: new Date().toISOString(),
          from: EMAIL_CONFIG.from
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 200
        });
      } catch (error: unknown) {
        console.error(`[${requestId}] Test email failed:`, error);
        return new Response(JSON.stringify({
          error: "Test email failed",
          details: error instanceof Error ? error.message : 'Unknown error',
          requestId,
          timestamp: new Date().toISOString(),
          from: EMAIL_CONFIG.from
        }), {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json"
          },
          status: 500
        });
      }
    }
  }

  // For all other requests, require authentication
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    console.error(`[${requestId}] Missing authorization header`);
    return new Response(JSON.stringify({
      error: "Missing authorization header",
      requestId
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      },
      status: 401
    });
  }

  try {
    // Log the raw request body
    const body = await req.text();
    console.log(`[${requestId}] Raw request body:`, body);

    let record;
    try {
      const parsedBody = JSON.parse(body);
      console.log(`[${requestId}] Parsed request body:`, {
        hasRecord: !!parsedBody.record,
        recordKeys: parsedBody.record ? Object.keys(parsedBody.record) : [],
        bodyKeys: Object.keys(parsedBody)
      });

      record = parsedBody.record || parsedBody;

      // Validate the booking record
      validateBookingRecord(record);
      console.log(`[${requestId}] Booking record validation passed`);
    } catch (e: unknown) {
      if (e instanceof Error) {
        console.error(`[${requestId}] Request parsing/validation failed:`, {
          error: e.message,
          stack: e.stack,
          body: body.substring(0, 1000) // Log first 1000 chars of body for debugging
        });
      } else {
        console.error(`[${requestId}] Unknown error parsing request body:`, e);
      }
      throw new Error(`Invalid request data: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }

    // Log the parsed record (excluding sensitive data)
    console.log(`[${requestId}] Processing booking record:`, {
      property_size: record.property_size,
      services_count: record.services?.length,
      total_amount: record.total_amount,
      agent_email: record.agent_email,
      agent_name: record.agent_name,
      preferred_date: record.preferred_date,
      time: record.time,
      property_status: record.property_status,
      address_type: typeof record.address,
      has_notes: !!record.notes,
      reference_number: record.reference_number
    });

    const {
      property_size,
      services,
      total_amount,
      address,
      notes,
      preferred_date,
      time,
      property_status,
      agent_name,
      agent_email,
      agent_phone,
      agent_company,
      reference_number
    } = record;

    // Format address
    const addressStr = typeof address === 'string'
      ? address
      : `${address.street}, ${address.city}, ${address.province} ${address.zipCode}`;

    // Format time for display (convert 24h to 12h format)
    const formatTime = (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    // Format services list
    const serviceList = services.map((service: any) => 
      `• ${service.name}${service.count > 1 ? ` (x${service.count})` : ''} - $${service.total.toFixed(2)}`
    ).join('\n');

    const emailBody = `Dear ${agent_name},

Thank you for choosing ${EMAIL_CONFIG.companyName} for your photography needs! We're excited to help showcase your property.

📸 BOOKING CONFIRMATION

${reference_number ? `📋 YOUR REFERENCE NUMBER: ${reference_number}

🔗 VIEW YOUR BOOKING ONLINE
You can view and track your booking details anytime at:
https://rephotos.ca/book-now/confirmation/${reference_number}

` : ''}PROPERTY DETAILS
• Size: ${formatPropertySizeDisplay(property_size)}
• Status: ${property_status}
• Preferred Date: ${new Date(preferred_date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })}
• Preferred Time: ${formatTime(time)}
• Address: ${addressStr}

SERVICES BOOKED
${serviceList}

TOTAL PRICE
$${total_amount.toFixed(2)}

${notes ? `ADDITIONAL NOTES\n${notes}\n\n` : ''}AGENT INFORMATION
• Name: ${agent_name}
• Email: ${agent_email}
${agent_phone ? `• Phone: ${agent_phone}` : ''}
${agent_company ? `• Company: ${agent_company}` : ''}

NEXT STEPS

We'll review your booking and confirm the appointment time.

Please ensure the property is ready by reviewing our Photo Day Prep Guide: https://www.rephotos.ca/photo-day

Our photographer will arrive on time and begin capturing the property as outlined in the checklist.

If you need to make any changes to your booking, simply reply to this email or call us at ${EMAIL_CONFIG.phone}.

Best regards,
Cooper Thompson
${EMAIL_CONFIG.companyName}
${EMAIL_CONFIG.phone}
${EMAIL_CONFIG.companyName.toLowerCase()}.ca`.trim();

    try {
      console.log(`[${requestId}] Sending booking confirmation email...`);
      const emailResponse = await sendEmail(
        [agent_email, "cooper@rephotosteam.com"],
        "📸 Booking Confirmation – RePhotos",
        emailBody
      );

      console.log(`[${requestId}] Email sent successfully!`);

      return new Response(JSON.stringify({
        message: "Booking confirmation email sent successfully",
        emailResponse,
        requestId
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      });
    } catch (emailError: unknown) {
      if (emailError instanceof Error) {
        console.error(`[${requestId}] Failed to send booking confirmation email:`, {
          error: emailError.message,
          stack: emailError.stack,
          cause: (emailError as any).cause
        });
        throw emailError;
      } else {
        console.error(`[${requestId}] Unknown error sending booking confirmation email:`, emailError);
        throw new Error("Unknown error sending booking confirmation email");
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`[${requestId}] Error in request handling:`, {
        error: error.message,
        stack: error.stack,
        cause: (error as any).cause,
        requestId
      });
      return new Response(JSON.stringify({
        error: "Failed to process request",
        details: error.message,
        requestId,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      });
    } else {
      console.error(`[${requestId}] Unknown error in request handling:`, error);
      return new Response(JSON.stringify({
        error: "Failed to process request",
        details: "Unknown error",
        requestId,
        timestamp: new Date().toISOString()
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 500
      });
    }
  }
}); 