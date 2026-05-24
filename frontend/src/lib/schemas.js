import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'At least 8 characters'),
});

export const signupSchema = z.object({
  full_name: z.string().min(2, 'Tell us your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(8, 'At least 8 characters'),
});

export const profileSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional().or(z.literal('')),
  dob: z.string().optional().or(z.literal('')),
  gender: z.string().optional().or(z.literal('')),
});

export const hostProfileSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().optional().or(z.literal('')),
  business_name: z.string().optional().or(z.literal('')),
  gst_number: z.string().optional().or(z.literal('')),
  payout_account: z.string().optional().or(z.literal('')),
});

export const bookingSchema = z.object({
  room_id: z.number().int().positive(),
  checkin_date: z.string().min(1, 'Pick a check-in date'),
  checkout_date: z.string().min(1, 'Pick a check-out date'),
  guests: z.number().int().min(1).max(10),
});

export const reviewSchema = z.object({
  booking_id: z.number().int().positive(),
  hotel_rating: z.number().min(1).max(5).optional(),
  hotel_comment: z.string().max(2000).optional(),
  room_rating: z.number().min(1).max(5).optional(),
  room_comment: z.string().max(2000).optional(),
});

export const hotelBasicsSchema = z.object({
  name: z.string().min(2, 'Hotel name required'),
  slug: z.string().min(2, 'A URL slug is required').regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers, dashes only'),
  region: z.string().min(1),
  city: z.string().min(1),
  description: z.string().min(20, 'Tell guests a bit more about it (20+ chars)'),
  hue: z.enum(['sand', 'ocean', 'forest', 'dusk', 'warm', 'cool']).default('sand'),
});
export const hotelAddressSchema = z.object({
  address: z.string().min(5),
  phone: z.string().optional().or(z.literal('')),
  checkin_time: z.string().default('15:00'),
  checkout_time: z.string().default('11:00'),
  amenities: z.array(z.string()).default([]),
});

export const roomSchema = z.object({
  type: z.string().min(2),
  view: z.string().optional().or(z.literal('')),
  beds: z.string().optional().or(z.literal('')),
  size_sqm: z.coerce.number().int().min(1).optional(),
  price_per_night: z.coerce.number().int().min(1, 'Price required'),
  hue: z.enum(['sand', 'ocean', 'forest', 'dusk', 'warm', 'cool']).default('sand'),
});
