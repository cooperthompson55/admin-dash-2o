-- Add reference_number column to bookings table
ALTER TABLE bookings ADD COLUMN reference_number TEXT;

-- Create a unique index on reference_number to ensure uniqueness
CREATE UNIQUE INDEX idx_bookings_reference_number ON bookings(reference_number);

-- Create a function to generate reference numbers
CREATE OR REPLACE FUNCTION generate_reference_number()
RETURNS TEXT AS $$
DECLARE
  ref_number TEXT;
  exists_count INTEGER;
BEGIN
  LOOP
    -- Generate a 8-character alphanumeric reference number
    ref_number := upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 8));
    
    -- Check if this reference number already exists
    SELECT COUNT(*) INTO exists_count 
    FROM bookings 
    WHERE reference_number = ref_number;
    
    -- If it doesn't exist, we can use it
    IF exists_count = 0 THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN ref_number;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to automatically generate reference numbers for new bookings
CREATE OR REPLACE FUNCTION set_booking_reference_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only set reference_number if it's not already provided
  IF NEW.reference_number IS NULL OR NEW.reference_number = '' THEN
    NEW.reference_number := generate_reference_number();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger on the bookings table
DROP TRIGGER IF EXISTS booking_reference_number_trigger ON bookings;

CREATE TRIGGER booking_reference_number_trigger
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION set_booking_reference_number();

-- Update existing bookings that don't have reference numbers
UPDATE bookings 
SET reference_number = generate_reference_number() 
WHERE reference_number IS NULL OR reference_number = '';

COMMENT ON FUNCTION generate_reference_number() IS 'Generates unique 8-character alphanumeric reference numbers for bookings';
COMMENT ON FUNCTION set_booking_reference_number() IS 'Automatically sets reference_number for new bookings if not provided';
COMMENT ON TRIGGER booking_reference_number_trigger ON bookings IS 'Automatically generates reference numbers for new bookings'; 