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
// Email configuration
const EMAIL_CONFIG = {
  from: "RePhotos.ca <cooper@rephotos.ca>",
  replyTo: "cooper@rephotos.ca",
  companyName: "Rephotos",
  phone: "905-299-9300"
};
// Add version logging
console.log("Function version: 1.0.9");
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
let resend;
try {
  console.log("Initializing Resend client...");
  resend = new Resend(RESEND_API_KEY);
  console.log("Resend client initialized successfully");
} catch (error) {
  console.error("Failed to initialize Resend client:", error);
  throw error;
}
// --- VOLUME DISCOUNT HELPERS ---
function getDiscountPercent(amount) {
  if (amount >= 1100) return 17;
  if (amount >= 900) return 15;
  if (amount >= 700) return 12;
  if (amount >= 500) return 10;
  if (amount >= 350) return 5;
  if (amount >= 199.99) return 3;
  return 0;
}
function calculateDiscountedTotal(amount) {
  const percent = getDiscountPercent(amount);
  const discount = +(amount * (percent / 100)).toFixed(2);
  return {
    percent,
    discount,
    final: +(amount - discount).toFixed(2)
  };
}
// Helper function to validate booking record
function validateBookingRecord(record) {
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
  const missingFields = requiredFields.filter((field)=>!record[field]);
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
    const requiredAddressFields = [
      'street',
      'city',
      'province',
      'zipCode'
    ];
    const missingAddressFields = requiredAddressFields.filter((field)=>!record.address[field]);
    if (missingAddressFields.length > 0) {
      throw new Error(`Missing required address fields: ${missingAddressFields.join(', ')}`);
    }
  }
  return true;
}
// Helper function to send email
async function sendEmail(to, subject, text) {
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
  } catch (error) {
    console.error("Error sending email:", {
      error: error.message,
      stack: error.stack,
      cause: error.cause,
      from: EMAIL_CONFIG.from
    });
    throw error;
  }
}
serve(async (req)=>{
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Function called at:`, new Date().toISOString());
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
        const testResponse = await sendEmail([
          "cooper@rephotos.ca"
        ], "Test Email from Edge Function", `This is a test email to verify the Resend client is working.\n\nFrom: ${EMAIL_CONFIG.from}\nReply-To: ${EMAIL_CONFIG.replyTo}\nCompany: ${EMAIL_CONFIG.companyName}`);
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
      } catch (error) {
        console.error(`[${requestId}] Test email failed:`, error);
        return new Response(JSON.stringify({
          error: "Test email failed",
          details: error.message,
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
    } catch (e) {
      console.error(`[${requestId}] Request parsing/validation failed:`, {
        error: e.message,
        stack: e.stack,
        body: body.substring(0, 1000) // Log first 1000 chars of body for debugging
      });
      throw new Error(`Invalid request data: ${e.message}`);
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
      has_notes: !!record.notes
    });
    const { property_size, services, total_amount, address, notes, preferred_date, time, property_status, agent_name, agent_email, agent_phone, agent_company } = record;
    // Format services for display
    const serviceList = services.map((service)=>`${service.name} (${service.count}x) - $${service.total}`).join("\n");
    // Format address
    const addressStr = typeof address === 'string' ? address : `${address.street}, ${address.city}, ${address.province} ${address.zipCode}`;
    // Format time for display (convert 24h to 12h format)
    const formatTime = (timeStr)=>{
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };
    // --- DISCOUNT CALC ---
    const rawTotal = typeof total_amount === 'number' ? total_amount : parseFloat(total_amount);
    const discountInfo = calculateDiscountedTotal(rawTotal);
    let priceSection = '';
    if (discountInfo.percent > 0) {
      priceSection = `Subtotal: $${rawTotal.toFixed(2)}\nVolume Discount: -$${discountInfo.discount.toFixed(2)}\nTotal After Discount: $${discountInfo.final.toFixed(2)}`;
    } else {
      priceSection = `Total Price: $${rawTotal.toFixed(2)}`;
    }
    const emailBody = `Dear ${agent_name},

Thank you for choosing ${EMAIL_CONFIG.companyName} for your photography needs! We're excited to help showcase your property.

📸 BOOKING CONFIRMATION

PROPERTY DETAILS
• Size: ${property_size}
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

${priceSection}

${notes ? `ADDITIONAL NOTES\n${notes}` : ''}

AGENT INFORMATION
• Name: ${agent_name}
• Email: ${agent_email}
${agent_phone ? `• Phone: ${agent_phone}` : ''}
${agent_company ? `• Company: ${agent_company}` : ''}

NEXT STEPS

We'll review your booking and confirm the appointment time.

Please ensure the property is ready by reviewing our Photo Day Prep Guide. https://www.rephotos.ca/photo-day

Our photographer will arrive on time and begin capturing the property as outlined in the checklist.

If you need to make any changes to your booking, simply reply to this email or call us at ${EMAIL_CONFIG.phone}.

Best regards,
Cooper Thompson
${EMAIL_CONFIG.from}
${EMAIL_CONFIG.phone}
${EMAIL_CONFIG.companyName.toLowerCase()}.ca`.trim();
    try {
      console.log(`[${requestId}] Sending booking confirmation email...`);
      const emailResponse = await sendEmail([
        agent_email,
        "cooper@rephotos.ca"
      ], "📸 Booking Confirmation – RePhotos", emailBody);
      console.log(`[${requestId}] Email sent successfully!`);
      return new Response(JSON.stringify({
        message: "Email sent successfully",
        emailResponse,
        requestId
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        },
        status: 200
      });
    } catch (emailError) {
      console.error(`[${requestId}] Failed to send booking confirmation email:`, {
        error: emailError.message,
        stack: emailError.stack,
        cause: emailError.cause
      });
      throw emailError;
    }
  } catch (error) {
    // Enhanced error logging
    console.error(`[${requestId}] Error in request handling:`, {
      error: error.message,
      stack: error.stack,
      cause: error.cause,
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
  }
});
