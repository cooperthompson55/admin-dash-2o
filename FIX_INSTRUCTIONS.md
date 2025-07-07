# 🔧 URGENT: Email Confirmation Fixes Required

## Issue Summary
The booking confirmation emails are not being sent due to configuration issues.

## 🚨 CRITICAL FIXES NEEDED:

### 1. Fix Environment Variable (IMMEDIATE)
**In your `.env.local` file, change:**
```
SEND_API_KEY=re_BwJ3QmLU_3ZQiQgugoU3xMWTvQ6NSmfAE
```
**To:**
```
RESEND_API_KEY=re_BwJ3QmLU_3ZQiQgugoU3xMWTvQ6NSmfAE
```

### 2. Domain Verification (IMMEDIATE)
**Option A: Verify your domain in Resend**
1. Go to https://resend.com/domains
2. Add `rephotos.ca` domain
3. Follow verification steps

**Option B: Use temporary fix (RECOMMENDED for now)**
The edge function has been updated to use `onboarding@resend.dev` which is already verified.

### 3. Deploy Updated Edge Function
```bash
supabase functions deploy booking-confirmation --project-ref jshnsfvvsmjlxlbdpehf
```

### 4. Set Environment Variables in Supabase
1. Go to https://supabase.com/dashboard/project/jshnsfvvsmjlxlbdpehf/settings/edge-functions
2. Add environment variable:
   - Key: `RESEND_API_KEY`
   - Value: `re_BwJ3QmLU_3ZQiQgugoU3xMWTvQ6NSmfAE`

## 🧪 Test After Fixes:

### Test 1: Edge Function
```bash
node test-email-simple.js
```

### Test 2: Local API (start dev server first)
```bash
npm run dev
# Then in another terminal:
node test-email-simple.js
```

### Test 3: Create a real booking
Use your application to create a booking and verify the email is sent.

## 📧 Expected Behavior After Fixes:
- Booking confirmation emails sent from `onboarding@resend.dev`
- Reply-to address: `cooper@rephotos.ca`
- Emails sent to both the agent and cooper@rephotos.ca
- Reference numbers included in emails
- Proper pricing and service formatting

## 🔍 Troubleshooting:
If emails still don't send:
1. Check Supabase Edge Function logs
2. Check Resend dashboard for delivery status
3. Verify RESEND_API_KEY is set correctly in both places
4. Ensure the edge function is deployed

## 📋 Status Checklist:
- [ ] Fixed SEND_API_KEY → RESEND_API_KEY in .env.local
- [ ] Deployed updated edge function
- [ ] Set RESEND_API_KEY in Supabase settings
- [ ] Tested edge function directly
- [ ] Tested via local API
- [ ] Verified email delivery 