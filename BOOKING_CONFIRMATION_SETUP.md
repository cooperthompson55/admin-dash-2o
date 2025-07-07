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
# Using the project reference: jshnsfvvsmjlxlbdpehf
supabase functions deploy booking-confirmation --project-ref jshnsfvvsmjlxlbdpehf
```

### 3. Set Environment Variables

In your Supabase dashboard:

1. Go to **Settings** > **Edge Functions**
2. Add the following environment variables:
   - `RESEND_API_KEY`: Your Resend API key

### 4. Set Up Database Trigger (Optional but Recommended)

Apply the database migration to automatically trigger emails:

```bash
# Apply the migration
supabase db push --project-ref jshnsfvvsmjlxlbdpehf

# Or run the SQL directly in your Supabase dashboard
```

**Important:** Set the anon key in your database:
```sql
ALTER DATABASE postgres SET app.supabase_anon_key = 'your_actual_anon_key_here';
```

### 5. Configure Your Application

Update your environment variables in `.env.local`:

```env
# Your Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=https://jshnsfvvsmjlxlbdpehf.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Resend API key (if using the API endpoint directly)
RESEND_API_KEY=your_resend_api_key
```

## Usage

### Method 1: Using the API Endpoint

Create bookings through the API endpoint:

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
  'https://jshnsfvvsmjlxlbdpehf.supabase.co/functions/v1/booking-confirmation',
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

### Quick Test Using the Test Script

```bash
# Run the test script with your anon key
node scripts/test-booking-confirmation.js your_anon_key_here
```

### Test the Edge Function

1. **Test endpoint (GET request):**
   ```
   https://jshnsfvvsmjlxlbdpehf.supabase.co/functions/v1/booking-confirmation/test
   ```

2. **Test with booking data (POST request):**
   ```bash
   curl -X POST \
     'https://jshnsfvvsmjlxlbdpehf.supabase.co/functions/v1/booking-confirmation' \
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
    "agent_company": "Test Realty",
    "notes": "This is a test booking"
  }'
```

## Troubleshooting

### Common Issues

1. **Environment Variables Not Set**
   - Check that `RESEND_API_KEY` is set in Supabase Edge Functions settings
   - Verify `.env.local` has correct Supabase URL and keys

2. **Edge Function Not Deployed**
   ```bash
   supabase functions deploy booking-confirmation --project-ref jshnsfvvsmjlxlbdpehf
   ```

3. **Database Trigger Not Working**
   - Ensure `pg_net` extension is enabled
   - Set the anon key in database configuration
   - Check function permissions

4. **Email Not Sending**
   - Verify Resend API key is correct
   - Check Supabase function logs
   - Test edge function directly

### Logs and Debugging

- **Supabase Function Logs:** Check in your Supabase dashboard under Edge Functions
- **Application Logs:** Check browser console and server logs
- **Email Logs:** Check Resend dashboard for delivery status

## Next Steps

1. Test the email functionality using the test script
2. Verify emails are being delivered to the correct addresses
3. Monitor logs for any errors or issues
4. Consider setting up email templates for better formatting

## Email Template

The confirmation email includes:

- 📸 **Booking confirmation header**
- 🏠 **Property details** (size, status, date, time, address)
- 📋 **Services booked** with pricing
- 💰 **Volume discount calculation** (if applicable)
- 📝 **Additional notes** (if provided)
- 👤 **Agent information**
- 📞 **Next steps and contact information**

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