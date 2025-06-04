# Booking Confirmation Email Setup Guide

This guide explains how to set up automatic booking confirmation emails using Supabase Edge Functions and database triggers.

## Overview

The booking confirmation system consists of:

1. **Supabase Edge Function** (`supabase/functions/booking-confirmation/index.ts`) - Sends confirmation emails
2. **API Endpoint** (`app/api/bookings/create/route.ts`) - Creates bookings and triggers emails
3. **Database Trigger** (optional) - Automatically triggers emails for any new booking
4. **Email Service** - Uses Resend for reliable email delivery

## Prerequisites

- Supabase project with database access
- Resend account and API key
- Node.js and npm installed
- Supabase CLI installed globally (`npm install -g supabase`)

## Setup Instructions

### 1. Install Supabase CLI and Login

```bash
# Install Supabase CLI globally
npm install -g supabase

# Login to Supabase
supabase login

# Check your projects
supabase projects list
```

### 2. Deploy the Edge Function

```bash
# Navigate to your project directory
cd /path/to/your/project

# Deploy the booking confirmation function
# Replace YOUR_PROJECT_REF with your actual project reference
supabase functions deploy booking-confirmation --project-ref YOUR_PROJECT_REF
```

**Find your project reference:**
- In your Supabase dashboard URL: `https://supabase.com/dashboard/project/YOUR_PROJECT_REF`
- Or run: `supabase projects list`

### 3. Set Environment Variables

In your Supabase dashboard:

1. Go to **Settings** > **Edge Functions**
2. Add the following environment variables:
   - `RESEND_API_KEY`: Your Resend API key

### 4. Set Up Database Trigger (Optional but Recommended)

Apply the database migration to automatically trigger emails:

```bash
# Apply the migration
supabase db push --project-ref YOUR_PROJECT_REF

# Or run the SQL directly in your Supabase dashboard
```

**Important:** Update the SQL migration file with your actual project reference:
- Edit `supabase/migrations/20241201_booking_confirmation_trigger.sql`
- Replace `YOUR_PROJECT_REF` with your actual project reference
- Replace `your_anon_key_here` with your Supabase anon key

### 5. Configure Your Application

Update your environment variables in `.env.local`:

```env
# Your existing Supabase variables
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend API key (if using the API endpoint directly)
RESEND_API_KEY=your_resend_api_key
```

## Usage

### Method 1: Using the API Endpoint

Create bookings through the new API endpoint:

```javascript
// POST /api/bookings/create
const response = await fetch('/api/bookings/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    property_size: '1000–1999 sq ft',
    services: [
      { name: 'HDR Photography', price: 249.99, count: 1 }
    ],
    total_amount: 249.99,
    address: {
      street: '123 Main Street',
      city: 'Toronto',
      province: 'ON',
      zipCode: 'M1A 1A1'
    },
    preferred_date: '2024-12-15',
    time: '10:00:00',
    property_status: 'Vacant',
    agent_name: 'John Doe',
    agent_email: 'john@example.com',
    agent_phone: '416-555-0123',
    agent_company: 'ABC Realty',
    notes: 'Please use the side entrance'
  })
})
```

### Method 2: Database Trigger (Automatic)

If you've set up the database trigger, confirmation emails will be sent automatically whenever a new booking is inserted into the `bookings` table, regardless of how it's created.

### Method 3: Manual Edge Function Call

Call the edge function directly:

```javascript
const response = await fetch(
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/booking-confirmation',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${your_supabase_anon_key}`,
    },
    body: JSON.stringify({
      record: bookingData
    })
  }
)
```

## Testing

### Test the Edge Function

1. **Test endpoint (GET request):**
   ```
   https://YOUR_PROJECT_REF.supabase.co/functions/v1/booking-confirmation/test
   ```

2. **Test with booking data (POST request):**
   ```bash
   curl -X POST \
     'https://YOUR_PROJECT_REF.supabase.co/functions/v1/booking-confirmation' \
     -H 'Authorization: Bearer YOUR_ANON_KEY' \
     -H 'Content-Type: application/json' \
     -d '{
       "record": {
         "property_size": "1000–1999 sq ft",
         "services": [{"name": "HDR Photography", "price": 249.99, "count": 1}],
         "total_amount": 249.99,
         "address": "123 Test St, Toronto, ON M1A 1A1",
         "preferred_date": "2024-12-15T00:00:00",
         "time": "10:00:00",
         "property_status": "Vacant",
         "agent_name": "Test User",
         "agent_email": "test@example.com"
       }
     }'
   ```

### Test the API Endpoint

```bash
curl -X POST \
  'http://localhost:3000/api/bookings/create' \
  -H 'Content-Type: application/json' \
  -d '{
    "property_size": "1000–1999 sq ft",
    "services": [{"name": "HDR Photography", "price": 249.99, "count": 1}],
    "total_amount": 249.99,
    "address": {
      "street": "123 Test Street",
      "city": "Toronto",
      "province": "ON",
      "zipCode": "M1A 1A1"
    },
    "preferred_date": "2024-12-15",
    "time": "10:00:00",
    "property_status": "Vacant",
    "agent_name": "Test User",
    "agent_email": "test@example.com",
    "agent_phone": "416-555-0123",
    "agent_company": "Test Realty"
  }'
```

## Email Template

The confirmation email includes:

- 📸 **Booking confirmation header**
- 🏠 **Property details** (size, status, date, time, address)
- 📋 **Services booked** with pricing
- 💰 **Volume discount calculation** (if applicable)
- 📝 **Additional notes** (if provided)
- 👤 **Agent information**
- 📞 **Next steps and contact information**

## Troubleshooting

### Common Issues

1. **Edge Function not deploying:**
   - Check if you're logged into Supabase CLI
   - Verify your project reference is correct
   - Ensure you have the necessary permissions

2. **Emails not sending:**
   - Verify RESEND_API_KEY is set in Supabase Edge Functions settings
   - Check the edge function logs in Supabase dashboard
   - Verify the Resend API key is valid

3. **Database trigger not working:**
   - Check if pg_net extension is enabled
   - Verify the trigger function exists: `SELECT * FROM pg_proc WHERE proname = 'send_booking_confirmation';`
   - Check database logs for errors

4. **API endpoint errors:**
   - Verify environment variables in `.env.local`
   - Check the booking data structure matches requirements
   - Review server logs for detailed error messages

### Viewing Logs

1. **Edge Function logs:**
   - Go to Supabase Dashboard > Edge Functions > booking-confirmation > Logs

2. **Database trigger logs:**
   - Go to Supabase Dashboard > Logs > Database
   - Filter for logs related to booking confirmations

3. **API endpoint logs:**
   - Check your Next.js application logs
   - Use browser developer tools for client-side debugging

## Support

For additional help:

- [Supabase Edge Functions Documentation](https://supabase.com/docs/guides/functions)
- [Resend API Documentation](https://resend.com/docs)
- [PostgreSQL Trigger Documentation](https://www.postgresql.org/docs/current/sql-createtrigger.html)

## Security Considerations

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Validate all input data before processing
- Consider rate limiting for the edge function
- Use proper error handling to avoid exposing sensitive information 