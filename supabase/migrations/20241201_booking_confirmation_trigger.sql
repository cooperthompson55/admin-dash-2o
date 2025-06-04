-- Create a trigger to automatically send booking confirmation emails when new bookings are inserted
-- This trigger will call the Supabase Edge Function to send confirmation emails

-- First, create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION send_booking_confirmation()
RETURNS TRIGGER AS $$
DECLARE
  function_url TEXT;
  payload JSONB;
  response HTTP_RESPONSE;
BEGIN
  -- Only proceed if this is an INSERT operation on a new booking
  IF TG_OP = 'INSERT' THEN
    -- Construct the edge function URL
    -- Replace 'YOUR_PROJECT_REF' with your actual Supabase project reference
    function_url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/booking-confirmation';
    
    -- Prepare the payload for the edge function
    payload := jsonb_build_object(
      'record', to_jsonb(NEW)
    );
    
    -- Log the attempt
    RAISE LOG 'Sending booking confirmation for booking ID: %', NEW.id;
    
    -- Call the edge function asynchronously using pg_net
    -- Note: This requires the pg_net extension to be enabled
    SELECT net.http_post(
      url := function_url,
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || current_setting('app.supabase_anon_key', true)
      ),
      body := payload
    ) INTO response;
    
    -- Log the response (optional, for debugging)
    IF response.status_code = 200 THEN
      RAISE LOG 'Booking confirmation sent successfully for booking ID: %', NEW.id;
    ELSE
      RAISE WARNING 'Failed to send booking confirmation for booking ID: %. Status: %, Response: %', 
        NEW.id, response.status_code, response.content;
    END IF;
    
  END IF;
  
  -- Always return NEW for INSERT triggers
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the bookings table
DROP TRIGGER IF EXISTS booking_confirmation_trigger ON bookings;

CREATE TRIGGER booking_confirmation_trigger
  AFTER INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION send_booking_confirmation();

-- Grant necessary permissions (if needed)
-- GRANT EXECUTE ON FUNCTION send_booking_confirmation() TO authenticated;
-- GRANT EXECUTE ON FUNCTION send_booking_confirmation() TO anon;

-- Enable pg_net extension if not already enabled
-- This extension is required for making HTTP requests from PostgreSQL
-- Note: You may need to run this as a superuser or request it from Supabase support
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Set up a custom configuration parameter to store the anon key
-- This should be set in your Supabase project settings
-- ALTER DATABASE postgres SET app.supabase_anon_key = 'your_anon_key_here';

COMMENT ON FUNCTION send_booking_confirmation() IS 'Automatically sends booking confirmation emails via edge function when new bookings are inserted';
COMMENT ON TRIGGER booking_confirmation_trigger ON bookings IS 'Triggers booking confirmation email sending for new bookings'; 