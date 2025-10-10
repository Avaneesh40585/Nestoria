-- =============================================
-- Nestoria Inc. Seed Data
-- =============================================

-- Insert Customers
INSERT INTO Customer (Full_name, Email, Password, PhoneNumber, Gender, Age, Address, Identity_No, TotalBookings) VALUES
('Rajesh Kumar', 'rajesh.kumar@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543210', 'Male', 32, '12, MG Road, Hyderabad', 'ADH123456789', 5),
('Priya Sharma', 'priya.sharma@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543211', 'Female', 28, '45, Jubilee Hills, Hyderabad', 'ADH223456789', 3),
('Amit Patel', 'amit.patel@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543212', 'Male', 35, '78, Banjara Hills, Hyderabad', 'ADH323456789', 7),
('Sneha Reddy', 'sneha.reddy@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543213', 'Female', 26, '23, Hitech City, Hyderabad', 'ADH423456789', 2),
('Vikram Singh', 'vikram.singh@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543214', 'Male', 40, '56, Andheri West, Mumbai', 'MUM123456789', 8),
('Ananya Iyer', 'ananya.iyer@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543215', 'Female', 29, '89, Bandra, Mumbai', 'MUM223456789', 4),
('Arjun Nair', 'arjun.nair@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543216', 'Male', 33, '12, Koramangala, Bangalore', 'BLR123456789', 6),
('Divya Menon', 'divya.menon@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543217', 'Female', 27, '34, Indiranagar, Bangalore', 'BLR223456789', 3),
('Karthik Rao', 'karthik.rao@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543218', 'Male', 31, '67, Whitefield, Bangalore', 'BLR323456789', 5),
('Meera Joshi', 'meera.joshi@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543219', 'Female', 30, '90, Powai, Mumbai', 'MUM323456789', 4),
('Rahul Verma', 'rahul.verma@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543220', 'Male', 34, '45, Connaught Place, Delhi', 'DEL123456789', 7),
('Neha Kapoor', 'neha.kapoor@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543221', 'Female', 25, '78, Saket, Delhi', 'DEL223456789', 2),
('Sanjay Gupta', 'sanjay.gupta@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543222', 'Male', 38, '23, Park Street, Kolkata', 'KOL123456789', 9),
('Pooja Desai', 'pooja.desai@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543223', 'Female', 28, '56, Salt Lake, Kolkata', 'KOL223456789', 3),
('Aditya Malhotra', 'aditya.malhotra@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543224', 'Male', 36, '89, Model Town, Pune', 'PUN123456789', 6),
('Riya Saxena', 'riya.saxena@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543225', 'Female', 24, '12, Koregaon Park, Pune', 'PUN223456789', 1),
('Rohit Bhat', 'rohit.bhat@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543226', 'Male', 37, '34, Jayanagar, Bangalore', 'BLR423456789', 8),
('Swati Sinha', 'swati.sinha@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543227', 'Female', 26, '67, Sector 62, Noida', 'NOI123456789', 2),
('Manish Agarwal', 'manish.agarwal@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543228', 'Male', 39, '90, Vaishali, Ghaziabad', 'GHZ123456789', 5),
('Kavya Pillai', 'kavya.pillai@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9876543229', 'Female', 27, '45, Viman Nagar, Pune', 'PUN323456789', 3);

-- Insert Hosts
INSERT INTO Host (Full_name, Email, Password, PhoneNumber, Gender, Age, Address, Identity_No) VALUES
('Suresh Mehta', 'suresh.mehta@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9123456789', 'Male', 45, '123, Business District, Hyderabad', 'HADH12345678'),
('Lakshmi Narayanan', 'lakshmi.n@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9123456790', 'Female', 42, '456, Marine Drive, Mumbai', 'HMUM12345678'),
('Deepak Chopra', 'deepak.chopra@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9123456791', 'Male', 50, '789, CBD, Bangalore', 'HBLR12345678'),
('Sunita Reddy', 'sunita.reddy@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9123456792', 'Female', 38, '234, Gachibowli, Hyderabad', 'HADH22345678'),
('Ramesh Kumar', 'ramesh.kumar@email.com', '$2b$10$abcdefghijklmnopqrstuv', '9123456793', 'Male', 47, '567, Bandra West, Mumbai', 'HMUM22345678');

-- Insert Hotels
INSERT INTO Hotel (HostID, HotelName, HotelAddress, Hoteldesc, Checkin_time, Checkout_time, ContactReceptionist, Reviews, OverallRating, HotelImg) VALUES
(1, 'Grand Hyderabad Palace', 'Banjara Hills, Hyderabad, Telangana 500034', 'Luxury 5-star hotel in the heart of Hyderabad with world-class amenities', '14:00:00', '11:00:00', '9876001001', 'Excellent service and beautiful rooms', 4.7, 'https://images.unsplash.com/photo-1566073771259-6a8506099945'),
(1, 'Hitech City Residency', 'HITEC City, Hyderabad, Telangana 500081', 'Modern business hotel near IT hub with conference facilities', '13:00:00', '12:00:00', '9876001002', 'Perfect for business travelers', 4.5, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa'),
(2, 'Mumbai Oceanview Resort', 'Juhu Beach, Mumbai, Maharashtra 400049', 'Beachfront luxury resort with stunning ocean views', '15:00:00', '11:00:00', '9876002001', 'Amazing beach access and facilities', 4.8, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4'),
(2, 'Gateway Suites Mumbai', 'Colaba, Mumbai, Maharashtra 400001', 'Historic hotel near Gateway of India with colonial charm', '14:00:00', '12:00:00', '9876002002', 'Great location and heritage ambiance', 4.6, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb'),
(3, 'Silicon Valley Inn', 'Whitefield, Bangalore, Karnataka 560066', 'Contemporary hotel in IT corridor with modern amenities', '13:30:00', '11:30:00', '9876003001', 'Excellent for tech professionals', 4.4, 'https://images.unsplash.com/photo-1455587734955-081b22074882'),
(3, 'Royal Bangalore Heritage', 'MG Road, Bangalore, Karnataka 560001', 'Premium hotel in city center with shopping and dining nearby', '14:00:00', '12:00:00', '9876003002', 'Perfect central location', 4.7, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791'),
(4, 'Cyber Towers Hotel', 'Madhapur, Hyderabad, Telangana 500081', 'Budget-friendly hotel with excellent connectivity', '12:00:00', '10:00:00', '9876004001', 'Good value for money', 4.2, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d'),
(4, 'Lake View Paradise', 'Hussain Sagar, Hyderabad, Telangana 500003', 'Scenic hotel overlooking beautiful Hussain Sagar Lake', '14:00:00', '11:00:00', '9876004002', 'Breathtaking lake views', 4.6, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9'),
(5, 'Andheri Executive Stay', 'Andheri East, Mumbai, Maharashtra 400069', 'Business hotel near airport with shuttle service', '13:00:00', '12:00:00', '9876005001', 'Convenient airport location', 4.3, 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461'),
(5, 'Powai Lake Resort', 'Powai, Mumbai, Maharashtra 400076', 'Tranquil lakeside resort away from city chaos', '15:00:00', '11:00:00', '9876005002', 'Peaceful and relaxing', 4.5, 'https://images.unsplash.com/photo-1570213489059-0aac6626cade'),
(1, 'Airport Comfort Inn', 'Shamshabad, Hyderabad, Telangana 500409', 'Convenient hotel for layover passengers near airport', '12:00:00', '11:00:00', '9876001003', 'Quick airport access', 4.1, 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e'),
(2, 'Marine Drive Elegance', 'Marine Drive, Mumbai, Maharashtra 400020', 'Upscale hotel with panoramic sea views', '14:30:00', '11:30:00', '9876002003', 'Stunning sunset views', 4.8, 'https://images.unsplash.com/photo-1549294413-26f195200c16'),
(3, 'Indiranagar Boutique', 'Indiranagar, Bangalore, Karnataka 560038', 'Charming boutique hotel in trendy neighborhood', '14:00:00', '12:00:00', '9876003003', 'Hip and stylish ambiance', 4.6, 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7'),
(4, 'Secunderabad Station Hotel', 'Secunderabad, Hyderabad, Telangana 500003', 'Budget hotel with easy railway access', '12:00:00', '10:00:00', '9876004003', 'Great for rail travelers', 4.0, 'https://images.unsplash.com/photo-1562790351-d273a961e0e9'),
(5, 'Bandra West Luxury Suites', 'Bandra West, Mumbai, Maharashtra 400050', 'Designer suites in upscale Bandra locality', '15:00:00', '12:00:00', '9876005003', 'Luxurious and spacious', 4.9, 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c');

-- Insert Rooms (2-4 rooms per hotel)
INSERT INTO Room (HotelID, RoomNumber, Room_type, Room_desc, Cost_per_night, Position_view, Room_Status, Room_Rating, Room_Review) VALUES
-- Grand Hyderabad Palace (HotelID 1)
(1, '101', 'Deluxe', 'Spacious deluxe room with king bed and city view', 3500.00, 'City View', 'Available', 4.6, 'Very comfortable stay'),
(1, '201', 'Premium Suite', 'Luxurious suite with separate living area', 6500.00, 'Garden View', 'Available', 4.8, 'Outstanding luxury'),
(1, '301', 'Executive Room', 'Business-friendly room with work desk', 4200.00, 'City View', 'Available', 4.5, 'Perfect for business'),
(1, '401', 'Presidential Suite', 'Top-tier suite with panoramic views', 12000.00, 'Panoramic', 'Available', 5.0, 'Absolutely stunning'),

-- Hitech City Residency (HotelID 2)
(2, '102', 'Standard', 'Comfortable standard room with modern amenities', 2800.00, 'Street View', 'Available', 4.3, 'Good value'),
(2, '202', 'Deluxe', 'Upgraded room with extra space', 3800.00, 'City View', 'Occupied', 4.5, 'Spacious and clean'),
(2, '302', 'Business Suite', 'Suite designed for corporate travelers', 5500.00, 'Skyline View', 'Available', 4.7, 'Excellent facilities'),

-- Mumbai Oceanview Resort (HotelID 3)
(3, '103', 'Ocean Deluxe', 'Beachfront room with ocean view', 5500.00, 'Ocean View', 'Available', 4.9, 'Waking up to waves'),
(3, '203', 'Beach Villa', 'Private villa with beach access', 9500.00, 'Direct Beach', 'Available', 5.0, 'Dream vacation spot'),
(3, '303', 'Pool View Suite', 'Suite overlooking infinity pool', 7200.00, 'Pool View', 'Available', 4.8, 'Relaxing atmosphere'),

-- Gateway Suites Mumbai (HotelID 4)
(4, '104', 'Heritage Room', 'Classic room with colonial decor', 4200.00, 'Gateway View', 'Available', 4.6, 'Beautiful heritage charm'),
(4, '204', 'Deluxe Heritage', 'Larger room with period furniture', 5800.00, 'Sea View', 'Available', 4.7, 'Nostalgic elegance'),
(4, '304', 'Premium Suite', 'Spacious suite with modern comfort', 7500.00, 'Harbor View', 'Occupied', 4.8, 'Best of both worlds'),

-- Silicon Valley Inn (HotelID 5)
(5, '105', 'Tech Room', 'Smart room with IoT features', 3200.00, 'Tech Park View', 'Available', 4.4, 'Very modern'),
(5, '205', 'Executive', 'Premium room for professionals', 4500.00, 'City View', 'Available', 4.6, 'Great workspace'),
(5, '305', 'Corner Suite', 'Large corner suite with dual views', 6200.00, 'Dual View', 'Available', 4.7, 'Spacious and bright'),

-- Royal Bangalore Heritage (HotelID 6)
(6, '106', 'Standard Royal', 'Comfortable room in heart of city', 3800.00, 'MG Road View', 'Available', 4.5, 'Central location'),
(6, '206', 'Royal Deluxe', 'Elegant room with premium amenities', 5200.00, 'City View', 'Available', 4.7, 'Luxurious stay'),
(6, '306', 'Royal Suite', 'Top-floor suite with exceptional service', 8500.00, 'Panoramic', 'Available', 4.9, 'Royal treatment'),

-- Cyber Towers Hotel (HotelID 7)
(7, '107', 'Budget Room', 'Clean budget accommodation', 1800.00, 'Street View', 'Available', 4.0, 'Basic but good'),
(7, '207', 'Standard Plus', 'Upgraded standard room', 2500.00, 'City View', 'Available', 4.2, 'Decent comfort'),
(7, '307', 'Deluxe', 'Best room category with extras', 3500.00, 'IT Hub View', 'Occupied', 4.4, 'Surprisingly good'),

-- Lake View Paradise (HotelID 8)
(8, '108', 'Lake View', 'Room with beautiful lake vista', 4000.00, 'Lake View', 'Available', 4.7, 'Scenic beauty'),
(8, '208', 'Lake Suite', 'Suite with balcony overlooking lake', 6500.00, 'Lake Front', 'Available', 4.8, 'Mesmerizing views'),
(8, '308', 'Premium Lake Villa', 'Private villa with lake access', 9000.00, 'Private Lake', 'Available', 4.9, 'Ultimate relaxation'),

-- Andheri Executive Stay (HotelID 9)
(9, '109', 'Airport Room', 'Soundproof room near airport', 2800.00, 'Runway View', 'Available', 4.2, 'Quiet despite location'),
(9, '209', 'Business Deluxe', 'Room for business travelers', 3800.00, 'City View', 'Available', 4.4, 'Productive stay'),
(9, '309', 'Executive Suite', 'Suite with office space', 5500.00, 'Skyline View', 'Available', 4.5, 'Work-friendly'),

-- Powai Lake Resort (HotelID 10)
(10, '110', 'Garden Room', 'Ground floor room with garden', 3500.00, 'Garden View', 'Available', 4.4, 'Peaceful ambiance'),
(10, '210', 'Lake Deluxe', 'Elevated room with lake view', 4800.00, 'Lake View', 'Available', 4.6, 'Serene atmosphere'),
(10, '310', 'Lakeside Villa', 'Private villa by the water', 8200.00, 'Lakeside', 'Occupied', 4.8, 'Perfect getaway'),

-- Airport Comfort Inn (HotelID 11)
(11, '111', 'Transit Room', 'Room for short stays', 2200.00, 'Airport View', 'Available', 4.0, 'Convenient layover'),
(11, '211', 'Comfort Plus', 'Enhanced comfort room', 3000.00, 'City View', 'Available', 4.2, 'Good night sleep'),

-- Marine Drive Elegance (HotelID 12)
(12, '112', 'Sea View Deluxe', 'Premium sea-facing room', 5500.00, 'Sea View', 'Available', 4.8, 'Incredible sunsets'),
(12, '212', 'Marine Suite', 'Luxury suite with balcony', 8500.00, 'Direct Sea View', 'Available', 4.9, 'Worth every penny'),
(12, '312', 'Penthouse', 'Top-floor penthouse luxury', 15000.00, '360 View', 'Available', 5.0, 'Unmatched elegance'),

-- Indiranagar Boutique (HotelID 13)
(13, '113', 'Boutique Standard', 'Stylish standard room', 3200.00, 'Street View', 'Available', 4.5, 'Trendy design'),
(13, '213', 'Boutique Deluxe', 'Designer deluxe room', 4500.00, 'Garden View', 'Available', 4.7, 'Artistic ambiance'),
(13, '313', 'Boutique Suite', 'Unique themed suite', 6800.00, 'Terrace View', 'Available', 4.8, 'One-of-a-kind experience'),

-- Secunderabad Station Hotel (HotelID 14)
(14, '114', 'Budget Single', 'Single bed budget room', 1500.00, 'Station View', 'Available', 3.9, 'No-frills stay'),
(14, '214', 'Budget Double', 'Double bed budget room', 2000.00, 'City View', 'Available', 4.1, 'Clean and affordable'),

-- Bandra West Luxury Suites (HotelID 15)
(15, '115', 'Designer Suite', 'Architecturally designed suite', 7500.00, 'Bandra View', 'Available', 4.9, 'Modern masterpiece'),
(15, '215', 'Luxury Penthouse', 'Two-bedroom penthouse', 12500.00, 'Sea and City View', 'Available', 5.0, 'Ultimate luxury'),
(15, '315', 'Celebrity Suite', 'Suite preferred by celebrities', 18000.00, 'Private Terrace', 'Available', 5.0, 'VIP treatment');

-- Insert Amenities
INSERT INTO Amenities (Amenity_name, Amenity_desc) VALUES
('Wi-Fi', 'High-speed wireless internet throughout the property'),
('Swimming Pool', 'Outdoor/indoor swimming pool with lifeguard'),
('Gym', '24/7 fitness center with modern equipment'),
('Spa', 'Full-service spa with massage and wellness treatments'),
('Restaurant', 'On-site dining with multi-cuisine options'),
('Room Service', '24-hour in-room dining service'),
('Parking', 'Free parking facility for guests'),
('Conference Room', 'Business meeting and conference facilities'),
('Airport Shuttle', 'Complimentary airport pickup and drop service'),
('Laundry', 'Professional laundry and dry cleaning service'),
('Bar', 'Cocktail bar and lounge'),
('Kids Play Area', 'Safe play zone for children'),
('Air Conditioning', 'Climate-controlled rooms'),
('TV', 'Smart TV with cable channels'),
('Mini Bar', 'In-room refrigerator with beverages');

-- Insert Hotel Amenities Relations
INSERT INTO Hotel_Amenities_Relation (HotelID, AmenityID, Availability_hrs) VALUES
-- Grand Hyderabad Palace
(1, 1, '24/7'), (1, 2, '6 AM - 10 PM'), (1, 3, '24/7'), (1, 4, '9 AM - 9 PM'), (1, 5, '7 AM - 11 PM'),
(1, 6, '24/7'), (1, 7, '24/7'), (1, 8, '24/7'), (1, 9, '24/7'), (1, 10, '8 AM - 8 PM'), (1, 11, '5 PM - 1 AM'),
-- Hitech City Residency
(2, 1, '24/7'), (2, 3, '24/7'), (2, 5, '7 AM - 11 PM'), (2, 6, '24/7'), (2, 7, '24/7'), (2, 8, '24/7'),
-- Mumbai Oceanview Resort
(3, 1, '24/7'), (3, 2, '24/7'), (3, 3, '5 AM - 11 PM'), (3, 4, '8 AM - 10 PM'), (3, 5, '6 AM - 12 AM'),
(3, 6, '24/7'), (3, 7, '24/7'), (3, 10, '8 AM - 8 PM'), (3, 11, '4 PM - 2 AM'), (3, 12, '8 AM - 8 PM'),
-- Gateway Suites Mumbai
(4, 1, '24/7'), (4, 3, '6 AM - 10 PM'), (4, 5, '7 AM - 11 PM'), (4, 6, '24/7'), (4, 7, '24/7'), (4, 10, '9 AM - 7 PM'),
-- Silicon Valley Inn
(5, 1, '24/7'), (5, 3, '24/7'), (5, 5, '6 AM - 11 PM'), (5, 6, '24/7'), (5, 7, '24/7'), (5, 8, '24/7'),
-- Royal Bangalore Heritage
(6, 1, '24/7'), (6, 2, '6 AM - 10 PM'), (6, 3, '24/7'), (6, 4, '9 AM - 9 PM'), (6, 5, '7 AM - 11 PM'),
(6, 6, '24/7'), (6, 7, '24/7'), (6, 10, '8 AM - 8 PM'), (6, 11, '6 PM - 1 AM'),
-- Cyber Towers Hotel
(7, 1, '24/7'), (7, 5, '7 AM - 10 PM'), (7, 6, '24/7'), (7, 7, '24/7'),
-- Lake View Paradise
(8, 1, '24/7'), (8, 2, '6 AM - 10 PM'), (8, 3, '24/7'), (8, 4, '8 AM - 10 PM'), (8, 5, '7 AM - 11 PM'),
(8, 6, '24/7'), (8, 7, '24/7'), (8, 10, '8 AM - 8 PM'), (8, 11, '5 PM - 12 AM'),
-- Andheri Executive Stay
(9, 1, '24/7'), (9, 3, '24/7'), (9, 5, '6 AM - 10 PM'), (9, 6, '24/7'), (9, 7, '24/7'), (9, 9, '24/7'),
-- Powai Lake Resort
(10, 1, '24/7'), (10, 2, '6 AM - 9 PM'), (10, 3, '6 AM - 10 PM'), (10, 4, '9 AM - 9 PM'), (10, 5, '7 AM - 11 PM'),
(10, 6, '24/7'), (10, 7, '24/7'), (10, 10, '8 AM - 8 PM'),
-- Airport Comfort Inn
(11, 1, '24/7'), (11, 5, '24/7'), (11, 6, '24/7'), (11, 7, '24/7'), (11, 9, '24/7'),
-- Marine Drive Elegance
(12, 1, '24/7'), (12, 2, '6 AM - 11 PM'), (12, 3, '24/7'), (12, 4, '8 AM - 10 PM'), (12, 5, '6 AM - 12 AM'),
(12, 6, '24/7'), (12, 7, '24/7'), (12, 10, '7 AM - 9 PM'), (12, 11, '4 PM - 2 AM'),
-- Indiranagar Boutique
(13, 1, '24/7'), (13, 3, '6 AM - 11 PM'), (13, 5, '7 AM - 11 PM'), (13, 6, '24/7'), (13, 7, '24/7'), (13, 11, '6 PM - 1 AM'),
-- Secunderabad Station Hotel
(14, 1, '24/7'), (14, 5, '7 AM - 10 PM'), (14, 6, '24/7'), (14, 7, '24/7'),
-- Bandra West Luxury Suites
(15, 1, '24/7'), (15, 2, '24/7'), (15, 3, '24/7'), (15, 4, '8 AM - 11 PM'), (15, 5, '24/7'),
(15, 6, '24/7'), (15, 7, '24/7'), (15, 8, '24/7'), (15, 10, '7 AM - 10 PM'), (15, 11, '3 PM - 2 AM');

-- Insert Room Amenities Relations (all rooms get Wi-Fi, AC, TV, Mini Bar)
INSERT INTO Room_Amenities_Relation (RoomID, AmenityID, Working_Status) VALUES
-- Standard amenities for all rooms (1-50)
(1, 1, TRUE), (1, 13, TRUE), (1, 14, TRUE), (1, 15, TRUE),
(2, 1, TRUE), (2, 13, TRUE), (2, 14, TRUE), (2, 15, TRUE),
(3, 1, TRUE), (3, 13, TRUE), (3, 14, TRUE), (3, 15, TRUE),
(4, 1, TRUE), (4, 13, TRUE), (4, 14, TRUE), (4, 15, TRUE),
(5, 1, TRUE), (5, 13, TRUE), (5, 14, TRUE), (5, 15, TRUE),
(6, 1, TRUE), (6, 13, TRUE), (6, 14, TRUE), (6, 15, TRUE),
(7, 1, TRUE), (7, 13, TRUE), (7, 14, TRUE), (7, 15, TRUE),
(8, 1, TRUE), (8, 13, TRUE), (8, 14, TRUE), (8, 15, TRUE),
(9, 1, TRUE), (9, 13, TRUE), (9, 14, TRUE), (9, 15, TRUE),
(10, 1, TRUE), (10, 13, TRUE), (10, 14, TRUE), (10, 15, TRUE),
(11, 1, TRUE), (11, 13, TRUE), (11, 14, TRUE), (11, 15, TRUE),
(12, 1, TRUE), (12, 13, TRUE), (12, 14, TRUE), (12, 15, TRUE),
(13, 1, TRUE), (13, 13, TRUE), (13, 14, TRUE), (13, 15, TRUE),
(14, 1, TRUE), (14, 13, TRUE), (14, 14, TRUE), (14, 15, TRUE),
(15, 1, TRUE), (15, 13, TRUE), (15, 14, TRUE), (15, 15, TRUE),
(16, 1, TRUE), (16, 13, TRUE), (16, 14, TRUE), (16, 15, TRUE),
(17, 1, TRUE), (17, 13, TRUE), (17, 14, TRUE), (17, 15, TRUE),
(18, 1, TRUE), (18, 13, TRUE), (18, 14, TRUE), (18, 15, TRUE),
(19, 1, TRUE), (19, 13, TRUE), (19, 14, TRUE), (19, 15, TRUE),
(20, 1, TRUE), (20, 13, TRUE), (20, 14, TRUE), (20, 15, TRUE),
(21, 1, TRUE), (21, 13, TRUE), (21, 14, TRUE), (21, 15, TRUE),
(22, 1, TRUE), (22, 13, TRUE), (22, 14, TRUE), (22, 15, TRUE),
(23, 1, TRUE), (23, 13, TRUE), (23, 14, TRUE), (23, 15, TRUE),
(24, 1, TRUE), (24, 13, TRUE), (24, 14, TRUE), (24, 15, TRUE),
(25, 1, TRUE), (25, 13, TRUE), (25, 14, TRUE), (25, 15, TRUE),
(26, 1, TRUE), (26, 13, TRUE), (26, 14, TRUE), (26, 15, TRUE),
(27, 1, TRUE), (27, 13, TRUE), (27, 14, TRUE), (27, 15, TRUE),
(28, 1, TRUE), (28, 13, TRUE), (28, 14, TRUE), (28, 15, TRUE),
(29, 1, TRUE), (29, 13, TRUE), (29, 14, TRUE), (29, 15, TRUE),
(30, 1, TRUE), (30, 13, TRUE), (30, 14, TRUE), (30, 15, TRUE),
(31, 1, TRUE), (31, 13, TRUE), (31, 14, TRUE), (31, 15, TRUE),
(32, 1, TRUE), (32, 13, TRUE), (32, 14, TRUE), (32, 15, TRUE),
(33, 1, TRUE), (33, 13, TRUE), (33, 14, TRUE), (33, 15, TRUE),
(34, 1, TRUE), (34, 13, TRUE), (34, 14, TRUE), (34, 15, TRUE),
(35, 1, TRUE), (35, 13, TRUE), (35, 14, TRUE), (35, 15, TRUE),
(36, 1, TRUE), (36, 13, TRUE), (36, 14, TRUE), (36, 15, TRUE),
(37, 1, TRUE), (37, 13, TRUE), (37, 14, TRUE), (37, 15, TRUE),
(38, 1, TRUE), (38, 13, TRUE), (38, 14, TRUE), (38, 15, TRUE),
(39, 1, TRUE), (39, 13, TRUE), (39, 14, TRUE), (39, 15, TRUE),
(40, 1, TRUE), (40, 13, TRUE), (40, 14, TRUE), (40, 15, TRUE),
(41, 1, TRUE), (41, 13, TRUE), (41, 14, TRUE), (41, 15, TRUE),
(42, 1, TRUE), (42, 13, TRUE), (42, 14, TRUE), (42, 15, TRUE),
(43, 1, TRUE), (43, 13, TRUE), (43, 14, TRUE), (43, 15, TRUE),
(44, 1, TRUE), (44, 13, TRUE), (44, 14, TRUE), (44, 15, TRUE),
(45, 1, TRUE), (45, 13, TRUE), (45, 14, TRUE), (45, 15, TRUE),
(46, 1, TRUE), (46, 13, TRUE), (46, 14, TRUE), (46, 15, TRUE),
(47, 1, TRUE), (47, 13, TRUE), (47, 14, TRUE), (47, 15, TRUE),
(48, 1, TRUE), (48, 13, TRUE), (48, 14, TRUE), (48, 15, TRUE),
(49, 1, TRUE), (49, 13, TRUE), (49, 14, TRUE), (49, 15, TRUE),
(50, 1, TRUE), (50, 13, TRUE), (50, 14, TRUE), (50, 15, TRUE);

-- Insert Employees
INSERT INTO Employee (HotelID, Name, Role, Hiring_date, Salaries, Status) VALUES
(1, 'Ramesh Yadav', 'Receptionist', '2020-03-15', 25000.00, 'active'),
(1, 'Sunita Devi', 'Housekeeping', '2019-06-20', 18000.00, 'active'),
(1, 'Prakash Kumar', 'Chef', '2021-01-10', 35000.00, 'active'),
(2, 'Anita Sharma', 'Receptionist', '2021-05-12', 24000.00, 'active'),
(2, 'Vijay Singh', 'Maintenance', '2020-08-25', 22000.00, 'active'),
(3, 'Kavita Nair', 'Receptionist', '2019-04-18', 28000.00, 'active'),
(3, 'Ravi Menon', 'Chef', '2018-11-30', 38000.00, 'active'),
(3, 'Deepa Joseph', 'Housekeeping', '2020-02-14', 19000.00, 'active'),
(4, 'Suresh Pillai', 'Receptionist', '2021-03-22', 26000.00, 'active'),
(4, 'Meera Kumari', 'Housekeeping', '2020-07-19', 18500.00, 'active'),
(5, 'Arun Kumar', 'Receptionist', '2020-09-10', 25000.00, 'active'),
(5, 'Lakshmi Bai', 'Housekeeping', '2019-12-05', 19500.00, 'active'),
(6, 'Madhavi Reddy', 'Receptionist', '2021-02-28', 27000.00, 'active'),
(6, 'Krishna Rao', 'Chef', '2019-08-15', 36000.00, 'active'),
(7, 'Santosh Kumar', 'Receptionist', '2021-06-01', 22000.00, 'active'),
(7, 'Radha Devi', 'Housekeeping', '2020-10-20', 17000.00, 'active'),
(8, 'Venkat Reddy', 'Receptionist', '2020-04-12', 26000.00, 'active'),
(8, 'Shalini Rao', 'Housekeeping', '2019-09-25', 19000.00, 'active'),
(9, 'Mohan Das', 'Receptionist', '2021-01-15', 24000.00, 'active'),
(9, 'Priya Sinha', 'Housekeeping', '2020-05-30', 18000.00, 'active'),
(10, 'Girish Patel', 'Receptionist', '2020-11-08', 25000.00, 'active'),
(10, 'Anjali Shah', 'Chef', '2019-07-22', 34000.00, 'active'),
(11, 'Mahesh Gupta', 'Receptionist', '2021-04-18', 23000.00, 'active'),
(12, 'Reshma Khan', 'Receptionist', '2020-02-10', 29000.00, 'active'),
(12, 'Salim Ahmed', 'Chef', '2019-05-14', 40000.00, 'active'),
(13, 'Nikhil Verma', 'Receptionist', '2021-03-05', 26000.00, 'active'),
(13, 'Pooja Jain', 'Housekeeping', '2020-08-12', 20000.00, 'active'),
(14, 'Sunil Yadav', 'Receptionist', '2021-05-20', 21000.00, 'active'),
(15, 'Arjun Kapoor', 'Receptionist', '2020-06-15', 30000.00, 'active'),
(15, 'Nisha Malhotra', 'Chef', '2019-10-28', 42000.00, 'active');

-- Insert Bookings
INSERT INTO Booking (CustomerID, RoomID, ReceptionistID, TransactionID, checkin_date, checkout_date, base_amount, tax_amount, final_amount, booking_status) VALUES
(1, 5, 4, 'TXN20240115001', '2024-02-10', '2024-02-13', 8400.00, 1512.00, 9912.00, TRUE),
(2, 12, 9, 'TXN20240116002', '2024-02-15', '2024-02-17', 8400.00, 1512.00, 9912.00, TRUE),
(3, 18, 17, 'TXN20240117003', '2024-02-20', '2024-02-23', 12000.00, 2160.00, 14160.00, TRUE),
(4, 23, 13, 'TXN20240118004', '2024-02-25', '2024-02-27', 9000.00, 1620.00, 10620.00, TRUE),
(5, 30, 21, 'TXN20240119005', '2024-03-01', '2024-03-04', 10500.00, 1890.00, 12390.00, TRUE),
(6, 8, 17, 'TXN20240120006', '2024-03-05', '2024-03-07', 8000.00, 1440.00, 9440.00, TRUE),
(7, 16, 13, 'TXN20240121007', '2024-03-10', '2024-03-13', 11400.00, 2052.00, 13452.00, TRUE),
(8, 24, 9, 'TXN20240122008', '2024-03-15', '2024-03-17', 8400.00, 1512.00, 9912.00, TRUE),
(9, 35, 26, 'TXN20240123009', '2024-03-20', '2024-03-23', 9600.00, 1728.00, 11328.00, TRUE),
(10, 1, 1, 'TXN20240124010', '2024-03-25', '2024-03-27', 7000.00, 1260.00, 8260.00, TRUE),
(11, 10, 6, 'TXN20240125011', '2024-04-01', '2024-04-04', 10500.00, 1890.00, 12390.00, TRUE),
(12, 19, 11, 'TXN20240126012', '2024-04-05', '2024-04-07', 5600.00, 1008.00, 6608.00, TRUE),
(13, 27, 19, 'TXN20240127013', '2024-04-10', '2024-04-13', 11400.00, 2052.00, 13452.00, TRUE),
(14, 32, 24, 'TXN20240128014', '2024-04-15', '2024-04-17', 17000.00, 3060.00, 20060.00, TRUE),
(15, 40, 22, 'TXN20240129015', '2024-04-20', '2024-04-23', 14400.00, 2592.00, 16992.00, TRUE),
(16, 3, 1, 'TXN20240130016', '2024-04-25', '2024-04-27', 8400.00, 1512.00, 9912.00, TRUE),
(17, 14, 9, 'TXN20240131017', '2024-05-01', '2024-05-04', 12600.00, 2268.00, 14868.00, TRUE),
(18, 21, 11, 'TXN20240201018', '2024-05-05', '2024-05-07', 6000.00, 1080.00, 7080.00, TRUE),
(19, 29, 19, 'TXN20240202019', '2024-05-10', '2024-05-13', 11400.00, 2052.00, 13452.00, TRUE),
(20, 37, 26, 'TXN20240203020', '2024-05-15', '2024-05-17', 9000.00, 1620.00, 10620.00, TRUE),
(1, 15, 9, 'TXN20240204021', '2024-05-20', '2024-05-23', 14100.00, 2538.00, 16638.00, TRUE),
(2, 25, 24, 'TXN20240205022', '2024-05-25', '2024-05-27', 17000.00, 3060.00, 20060.00, TRUE),
(3, 31, 11, 'TXN20240206023', '2024-06-01', '2024-06-04', 6600.00, 1188.00, 7788.00, TRUE),
(4, 38, 26, 'TXN20240207024', '2024-06-05', '2024-06-07', 13600.00, 2448.00, 16048.00, TRUE),
(5, 6, 4, 'TXN20240208025', '2024-06-10', '2024-06-13', 11400.00, 2052.00, 13452.00, TRUE),
(6, 13, 6, 'TXN20240209026', '2024-06-15', '2024-06-17', 10400.00, 1872.00, 12272.00, TRUE),
(7, 20, 24, 'TXN20240210027', '2024-06-20', '2024-06-23', 25500.00, 4590.00, 30090.00, TRUE),
(8, 26, 13, 'TXN20240211028', '2024-06-25', '2024-06-27', 10400.00, 1872.00, 12272.00, TRUE),
(9, 33, 26, 'TXN20240212029', '2024-07-01', '2024-07-04', 9000.00, 1620.00, 10620.00, TRUE),
(10, 39, 29, 'TXN20240213030', '2024-07-05', '2024-07-07', 15000.00, 2700.00, 17700.00, TRUE),
(11, 2, 1, 'TXN20240214031', '2024-07-10', '2024-07-13', 19500.00, 3510.00, 23010.00, TRUE),
(12, 9, 6, 'TXN20240215032', '2024-07-15', '2024-07-17', 9000.00, 1620.00, 10620.00, TRUE),
(13, 17, 13, 'TXN20240216033', '2024-07-20', '2024-07-23', 15600.00, 2808.00, 18408.00, TRUE),
(14, 22, 11, 'TXN20240217034', '2024-07-25', '2024-07-27', 9600.00, 1728.00, 11328.00, TRUE),
(15, 28, 17, 'TXN20240218035', '2024-08-01', '2024-08-04', 12000.00, 2160.00, 14160.00, TRUE),
(16, 34, 26, 'TXN20240219036', '2024-08-05', '2024-08-07', 9000.00, 1620.00, 10620.00, TRUE),
(17, 41, 23, 'TXN20240220037', '2024-08-10', '2024-08-13', 6600.00, 1188.00, 7788.00, TRUE),
(18, 7, 4, 'TXN20240221038', '2024-08-15', '2024-08-17', 11000.00, 1980.00, 12980.00, TRUE),
(19, 36, 21, 'TXN20240222039', '2024-08-20', '2024-08-23', 14400.00, 2592.00, 16992.00, TRUE),
(20, 45, 28, 'TXN20240223040', '2024-08-25', '2024-08-27', 4000.00, 720.00, 4720.00, TRUE);
