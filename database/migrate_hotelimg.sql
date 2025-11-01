-- Migration to change HotelImg column from VARCHAR(255) to TEXT
-- This allows storing base64 encoded images which can be very large

ALTER TABLE Hotel 
ALTER COLUMN HotelImg TYPE TEXT;

-- Verify the change
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'hotel' AND column_name = 'hotelimg';
