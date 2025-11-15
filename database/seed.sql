-- =============================================
-- Nestoria Inc. Complete Seed Data
-- Password for ALL users: "Password123!"
-- Bcrypt hash: $2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy
-- =============================================

-- =============================================
-- Insert Amenities (20 amenities as per schema)
-- =============================================
INSERT INTO Amenities (Amenity_Name) VALUES
('WiFi'),
('Parking'),
('Swimming Pool'),
('Gym'),
('Restaurant'),
('Room Service'),
('Air Conditioning'),
('TV'),
('Mini Bar'),
('Balcony'),
('Pet Friendly'),
('Breakfast Included'),
('Spa'),
('Conference Room'),
('Airport Shuttle'),
('Laundry Service'),
('24/7 Security'),
('Elevator'),
('Kitchen'),
('Wheelchair Accessible');

-- =============================================
-- Insert Hosts (5 hosts) - Note: Host table has Full_Name not FullName
-- =============================================
INSERT INTO Host (HostID, Full_Name, Email, Password, Phone_Number, Gender, Age, Address) VALUES
('AADH12345678', 'Rajesh Kumar', 'rajesh.kumar@nestoria.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919876543210', 'Male', 45, '123, MG Road, Bangalore, Karnataka'),
('AADH87654321', 'Priya Sharma', 'priya.sharma@nestoria.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919876543211', 'Female', 38, '456, Park Street, Kolkata, West Bengal'),
('AADH11111111', 'Amit Patel', 'amit.patel@nestoria.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919876543212', 'Male', 42, '789, FC Road, Pune, Maharashtra'),
('AADH22222222', 'Sneha Reddy', 'sneha.reddy@nestoria.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919876543213', 'Female', 35, '321, Banjara Hills, Hyderabad, Telangana'),
('AADH33333333', 'Vikram Singh', 'vikram.singh@nestoria.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919876543214', 'Male', 50, '654, Connaught Place, New Delhi, Delhi');

-- =============================================
-- Insert Customers (50 customers) - Note: Full_Name not FullName, Phone_Number not PhoneNumber, Total_Bookings not TotalBookings
-- =============================================
INSERT INTO Customer (CustomerID, Full_Name, Email, Password, Phone_Number, Gender, Age, Address, Total_Bookings) VALUES
('CUST00000001', 'Aarav Kapoor', 'aarav.kapoor@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456701', 'Male', 28, '12-A, Sector 15, Noida, Uttar Pradesh', 0),
('CUST00000002', 'Ishita Verma', 'ishita.verma@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456702', 'Female', 25, '45-B, Koramangala, Bangalore, Karnataka', 0),
('CUST00000003', 'Rohan Joshi', 'rohan.joshi@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456703', 'Male', 32, '78, Model Town, Ludhiana, Punjab', 0),
('CUST00000004', 'Aisha Khan', 'aisha.khan@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456704', 'Female', 30, '23, Civil Lines, Jaipur, Rajasthan', 0),
('CUST00000005', 'Kabir Malhotra', 'kabir.malhotra@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456705', 'Male', 27, '56, Salt Lake, Kolkata, West Bengal', 0),
('CUST00000006', 'Myra Sinha', 'myra.sinha@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456706', 'Female', 29, '89, Jubilee Hills, Hyderabad, Telangana', 0),
('CUST00000007', 'Vivaan Rao', 'vivaan.rao@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456707', 'Male', 35, '34, Powai, Mumbai, Maharashtra', 0),
('CUST00000008', 'Saanvi Pillai', 'saanvi.pillai@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456708', 'Female', 26, '67, Ulsoor, Bangalore, Karnataka', 0),
('CUST00000009', 'Aryan Chawla', 'aryan.chawla@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456709', 'Male', 31, '12, Sector 17, Chandigarh, Punjab', 0),
('CUST00000010', 'Anaya Bhatt', 'anaya.bhatt@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456710', 'Female', 24, '90, Vastrapur, Ahmedabad, Gujarat', 0),
('CUST00000011', 'Advait Nambiar', 'advait.nambiar@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456711', 'Male', 33, '15, Thiruvanmiyur, Chennai, Tamil Nadu', 0),
('CUST00000012', 'Diya Menon', 'diya.menon@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456712', 'Female', 27, '88, Indiranagar, Bangalore, Karnataka', 0),
('CUST00000013', 'Reyansh Gupta', 'reyansh.gupta@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456713', 'Male', 29, '44, Gomti Nagar, Lucknow, Uttar Pradesh', 0),
('CUST00000014', 'Kiara Saxena', 'kiara.saxena@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456714', 'Female', 26, '77, Bani Park, Jaipur, Rajasthan', 0),
('CUST00000015', 'Ayaan Sheikh', 'ayaan.sheikh@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456715', 'Male', 31, '22, Ballygunge, Kolkata, West Bengal', 0),
('CUST00000016', 'Aadhya Iyer', 'aadhya.iyer@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456716', 'Female', 28, '55, Mylapore, Chennai, Tamil Nadu', 0),
('CUST00000017', 'Vihaan Desai', 'vihaan.desai@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456717', 'Male', 34, '33, Satellite, Ahmedabad, Gujarat', 0),
('CUST00000018', 'Navya Pillai', 'navya.pillai@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456718', 'Female', 25, '66, Kakkanad, Kochi, Kerala', 0),
('CUST00000019', 'Atharv Jain', 'atharv.jain@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456719', 'Male', 30, '99, Indore Central, Indore, Madhya Pradesh', 0),
('CUST00000020', 'Pari Bose', 'pari.bose@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456720', 'Female', 27, '11, Rajarhat, Kolkata, West Bengal', 0),
('CUST00000021', 'Shaurya Singh', 'shaurya.singh@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456721', 'Male', 32, '77, Vasant Kunj, New Delhi, Delhi', 0),
('CUST00000022', 'Shanaya Reddy', 'shanaya.reddy@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456722', 'Female', 29, '44, Kondapur, Hyderabad, Telangana', 0),
('CUST00000023', 'Dhruv Mehta', 'dhruv.mehta@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456723', 'Male', 28, '88, Juhu, Mumbai, Maharashtra', 0),
('CUST00000024', 'Ira Gupta', 'ira.gupta@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456724', 'Female', 26, '33, Hinjewadi, Pune, Maharashtra', 0),
('CUST00000025', 'Aditya Kumar', 'aditya.kumar@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456725', 'Male', 35, '22, Whitefield, Bangalore, Karnataka', 0),
('CUST00000026', 'Zara Malik', 'zara.malik@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456726', 'Female', 24, '55, Viman Nagar, Pune, Maharashtra', 0),
('CUST00000027', 'Pranav Nair', 'pranav.nair@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456727', 'Male', 31, '66, Panjim, Goa', 0),
('CUST00000028', 'Siya Agarwal', 'siya.agarwal@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456728', 'Female', 27, '99, Hazratganj, Lucknow, Uttar Pradesh', 0),
('CUST00000029', 'Arnav Sharma', 'arnav.sharma@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456729', 'Male', 30, '11, Sector 62, Noida, Uttar Pradesh', 0),
('CUST00000030', 'Riya Chawla', 'riya.chawla@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456730', 'Female', 25, '44, South Extension, New Delhi, Delhi', 0),
('CUST00000031', 'Ishaan Pandey', 'ishaan.pandey@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456731', 'Male', 33, '77, Malad, Mumbai, Maharashtra', 0),
('CUST00000032', 'Anvi Shetty', 'anvi.shetty@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456732', 'Female', 28, '88, Jayanagar, Bangalore, Karnataka', 0),
('CUST00000033', 'Rudra Verma', 'rudra.verma@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456733', 'Male', 29, '22, Salt Lake, Kolkata, West Bengal', 0),
('CUST00000034', 'Mira Rao', 'mira.rao@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456734', 'Female', 26, '55, Gachibowli, Hyderabad, Telangana', 0),
('CUST00000035', 'Krish Patel', 'krish.patel@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456735', 'Male', 34, '33, Prahlad Nagar, Ahmedabad, Gujarat', 0),
('CUST00000036', 'Tara Singh', 'tara.singh@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456736', 'Female', 27, '66, Rajouri Garden, New Delhi, Delhi', 0),
('CUST00000037', 'Yash Kapoor', 'yash.kapoor@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456737', 'Male', 31, '99, Andheri, Mumbai, Maharashtra', 0),
('CUST00000038', 'Ahana Deshmukh', 'ahana.deshmukh@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456738', 'Female', 25, '11, Kothrud, Pune, Maharashtra', 0),
('CUST00000039', 'Karthik Iyer', 'karthik.iyer@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456739', 'Male', 30, '44, T Nagar, Chennai, Tamil Nadu', 0),
('CUST00000040', 'Samaira Khan', 'samaira.khan@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456740', 'Female', 28, '77, Hazratganj, Lucknow, Uttar Pradesh', 0),
('CUST00000041', 'Laksh Reddy', 'laksh.reddy@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456741', 'Male', 32, '88, Hitech City, Hyderabad, Telangana', 0),
('CUST00000042', 'Avni Joshi', 'avni.joshi@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456742', 'Female', 26, '22, Marathahalli, Bangalore, Karnataka', 0),
('CUST00000043', 'Neil Malhotra', 'neil.malhotra@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456743', 'Male', 29, '55, Model Town, Ludhiana, Punjab', 0),
('CUST00000044', 'Anika Pillai', 'anika.pillai@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456744', 'Female', 27, '33, Ernakulam, Kochi, Kerala', 0),
('CUST00000045', 'Sai Kumar', 'sai.kumar@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456745', 'Male', 35, '66, Besant Nagar, Chennai, Tamil Nadu', 0),
('CUST00000046', 'Nisha Gupta', 'nisha.gupta@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456746', 'Female', 24, '99, Dwarka, New Delhi, Delhi', 0),
('CUST00000047', 'Raj Mehta', 'raj.mehta@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456747', 'Male', 31, '11, Bandra, Mumbai, Maharashtra', 0),
('CUST00000048', 'Prisha Desai', 'prisha.desai@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456748', 'Female', 28, '44, Navrangpura, Ahmedabad, Gujarat', 0),
('CUST00000049', 'Aarush Nair', 'aarush.nair@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456749', 'Male', 30, '77, Electronic City, Bangalore, Karnataka', 0),
('CUST00000050', 'Tanvi Sharma', 'tanvi.sharma@gmail.com', '$2b$10$rG8zvHXHvZqZ9XJqHxLdyO7kJX.nN8jJVLZGvXxKQBLqGGVJ6xZPy', '+919123456750', 'Female', 25, '88, Park Street, Kolkata, West Bengal', 0);

-- =============================================
-- Insert Hotels (20 hotels) - Note: Hotel_Name not HotelName, Hotel_Address not HotelAddress, etc.
-- =============================================
INSERT INTO Hotel (HotelID, HostID, Hotel_Name, Hotel_Address, Hotel_Description, Checkin_Time, Checkout_Time, Receptionist_Number, Overall_Rating, Overall_Score, Hotel_Img) VALUES
('AADHTEL001', 'AADH12345678', 'The Grand Bangalore Palace', '123, MG Road, Bangalore, Karnataka 560001', 'Experience luxury redefined at The Grand Bangalore Palace, an iconic five-star property that seamlessly blends traditional Indian hospitality with contemporary elegance.', '14:00:00', '11:00:00', '+918012345001', NULL, NULL, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'),
('AADHTEL002', 'AADH87654321', 'Heritage Haveli Jaipur', '456, MI Road, Jaipur, Rajasthan 302001', 'Step back in time at Heritage Haveli Jaipur, a beautifully restored 18th-century mansion transformed into an intimate boutique hotel.', '13:00:00', '12:00:00', '+911412345002', NULL, NULL, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200'),
('AADHTEL003', 'AADH11111111', 'Coastal Breeze Resort Goa', '789, Calangute Beach Road, Goa 403516', 'Discover paradise at Coastal Breeze Resort Goa where pristine white sand beaches meet azure waters of the Arabian Sea.', '15:00:00', '11:00:00', '+918322345003', NULL, NULL, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200'),
('AADHTEL004', 'AADH22222222', 'Metropolitan Heights Mumbai', '234, Marine Drive, Mumbai, Maharashtra 400020', 'Soar to new heights of luxury at Metropolitan Heights Mumbai with unparalleled views of the Arabian Sea.', '14:00:00', '11:00:00', '+912212345004', NULL, NULL, 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1200'),
('AADHTEL005', 'AADH33333333', 'Himalayan Retreat Shimla', '567, Mall Road, Shimla, Himachal Pradesh 171001', 'Escape to the tranquil mountains at Himalayan Retreat Shimla, a luxurious mountain resort with panoramic Himalayan views.', '13:00:00', '12:00:00', '+911772345005', NULL, NULL, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'),
('AADHTEL006', 'AADH12345678', 'Royal Palace Udaipur', '890, Lake Palace Road, Udaipur, Rajasthan 313001', 'Live like royalty at Royal Palace Udaipur, a magnificent lakefront hotel overlooking Lake Pichola.', '14:00:00', '11:00:00', '+912942345006', NULL, NULL, 'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?w=1200'),
('AADHTEL007', 'AADH87654321', 'Tech Valley Hyderabad', '345, HITEC City, Hyderabad, Telangana 500081', 'Welcome to Tech Valley Hyderabad, a futuristic business hotel designed for modern technology professionals.', '14:00:00', '11:00:00', '+914012345007', NULL, NULL, 'https://images.unsplash.com/photo-1496417263034-38ec4f0b665a?w=1200'),
('AADHTEL008', 'AADH11111111', 'Backwater Paradise Kerala', '678, Vembanad Lake, Alleppey, Kerala 688001', 'Immerse yourself in the tranquil beauty of Kerala at Backwater Paradise on the banks of Vembanad Lake.', '15:00:00', '11:00:00', '+914772345008', NULL, NULL, 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200'),
('AADHTEL009', 'AADH22222222', 'Garden City Business Hub', '123, Whitefield Road, Bangalore, Karnataka 560066', 'Garden City Business Hub balances professional efficiency with comfort in Bangalore''s eastern IT corridor.', '14:00:00', '12:00:00', '+918012345009', NULL, NULL, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1200'),
('AADHTEL010', 'AADH33333333', 'Desert Oasis Jaisalmer', '456, Sam Sand Dunes Road, Jaisalmer, Rajasthan 345001', 'Experience the magic of the Thar Desert at Desert Oasis Jaisalmer, a luxury desert resort.', '13:00:00', '11:00:00', '+912992345010', NULL, NULL, 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1200'),
('AADHTEL011', 'AADH12345678', 'Riverside Luxury Rishikesh', '789, Shivpuri Road, Rishikesh, Uttarakhand 249201', 'Find your spiritual center at Riverside Luxury Rishikesh on the banks of the holy Ganges River.', '14:00:00', '11:00:00', '+911352345011', NULL, NULL, 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200'),
('AADHTEL012', 'AADH87654321', 'Colonial Heritage Kolkata', '234, Park Street, Kolkata, West Bengal 700016', 'Step into the elegance of colonial India at Colonial Heritage Kolkata.', '13:00:00', '12:00:00', '+913312345012', NULL, NULL, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1200'),
('AADHTEL013', 'AADH11111111', 'Spice Garden Coorg', '567, Madikeri Road, Coorg, Karnataka 571201', 'Discover the coffee capital of India at Spice Garden Coorg, a plantation resort among coffee and spice estates.', '15:00:00', '11:00:00', '+918272345013', NULL, NULL, 'https://images.unsplash.com/photo-1562790351-d273a961e0e9?w=1200'),
('AADHTEL014', 'AADH22222222', 'Silicon Valley Pune', '890, Hinjewadi Phase 2, Pune, Maharashtra 411057', 'Silicon Valley Pune caters to tech-savvy travelers visiting Pune''s rapidly growing IT hub.', '14:00:00', '12:00:00', '+912012345014', NULL, NULL, 'https://images.unsplash.com/photo-1597663531621-0e54a7e8b5ff?w=1200'),
('AADHTEL015', 'AADH33333333', 'Lakefront Serenity Nainital', '123, Mallital, Nainital, Uttarakhand 263001', 'Escape to the hills at Lakefront Serenity Nainital with spectacular Naini Lake and mountain views.', '13:00:00', '12:00:00', '+915942345015', NULL, NULL, 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200'),
('AADHTEL016', 'AADH12345678', 'The Literary Chennai', '456, Adyar, Chennai, Tamil Nadu 600020', 'Celebrate Tamil Nadu''s rich literary heritage at The Literary Chennai.', '14:00:00', '11:00:00', '+914412345016', NULL, NULL, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200'),
('AADHTEL017', 'AADH87654321', 'Mountain View Resort Darjeeling', '789, Observatory Hill Road, Darjeeling, West Bengal 734101', 'Wake up to the world''s third-highest peak at Mountain View Resort Darjeeling.', '13:00:00', '12:00:00', '+913542345017', NULL, NULL, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200'),
('AADHTEL018', 'AADH11111111', 'Urban Chic Delhi', '234, Aerocity, New Delhi, Delhi 110037', 'Experience contemporary luxury at Urban Chic Delhi near the international airport.', '14:00:00', '12:00:00', '+911112345018', NULL, NULL, 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=1200'),
('AADHTEL019', 'AADH22222222', 'Wildlife Lodge Ranthambore', '567, Ranthambore Road, Sawai Madhopur, Rajasthan 322001', 'Embark on a thrilling safari adventure at Wildlife Lodge Ranthambore.', '13:00:00', '11:00:00', '+917462345019', NULL, NULL, 'https://images.unsplash.com/photo-1580655653885-65763b2597d0?w=1200'),
('AADHTEL020', 'AADH33333333', 'Temple Town Varanasi', '890, Assi Ghat Road, Varanasi, Uttar Pradesh 221005', 'Experience the spiritual heart of India at Temple Town Varanasi overlooking the sacred Ganges River.', '14:00:00', '12:00:00', '+915422345020', NULL, NULL, 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=1200');

-- =============================================
-- Insert Rooms (Sample rooms for all hotels) - Note: Room_Type not RoomType, Cost_Per_Night not CostPerNight, etc.
-- =============================================
INSERT INTO Room (HotelID, RoomID, Room_Type, Room_Description, Cost_Per_Night, Position_View, Room_Status, Room_Review, Room_Img, Overall_Rating, Overall_Score) VALUES
('AADHTEL001', 'R101', 'Deluxe Suite', 'Spacious 450 sq ft suite with king bed, city views, and premium amenities', 8500.00, 'City View', 'Available', NULL, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200', NULL, NULL),
('AADHTEL001', 'R102', 'Executive Room', 'Business-friendly 380 sq ft room with workspace and executive lounge access', 6500.00, 'City View', 'Available', NULL, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200', NULL, NULL),
('AADHTEL001', 'R103', 'Premium Suite', 'Luxurious 600 sq ft suite with separate living room and panoramic city views', 12500.00, 'City Skyline', 'Available', NULL, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', NULL, NULL),
('AADHTEL002', 'R201', 'Royal Heritage Suite', 'Regal 650 sq ft suite with Rajasthani architecture and courtyard views', 15000.00, 'Courtyard View', 'Available', NULL, 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=1200', NULL, NULL),
('AADHTEL002', 'R202', 'Maharaja Suite', 'Opulent 500 sq ft suite with Hawa Mahal views and traditional furnishings', 13000.00, 'Hawa Mahal View', 'Available', NULL, 'https://images.unsplash.com/photo-1571508601891-ca5e7a713859?w=1200', NULL, NULL),
('AADHTEL003', 'R301', 'Beach Villa', 'Luxurious 800 sq ft villa with direct beach access and ocean views', 14000.00, 'Beachfront', 'Available', NULL, 'https://images.unsplash.com/photo-1573052905904-34ad8c27f0cc?w=1200', NULL, NULL),
('AADHTEL003', 'R302', 'Ocean View Suite', 'Spectacular 600 sq ft suite with panoramic Arabian Sea views', 9500.00, 'Ocean View', 'Available', NULL, 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1200', NULL, NULL),
('AADHTEL004', 'R401', 'Executive Room', 'Modern 380 sq ft room with city skyline views, perfect for business', 8000.00, 'City View', 'Available', NULL, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200', NULL, NULL),
('AADHTEL004', 'R402', 'Deluxe Suite', 'Spacious 550 sq ft suite with ocean views and premium lounge access', 12000.00, 'Ocean View', 'Available', NULL, 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200', NULL, NULL),
('AADHTEL005', 'R501', 'Mountain View Room', 'Cozy 400 sq ft colonial room with Himalayan peak views', 9000.00, 'Mountain View', 'Available', NULL, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200', NULL, NULL),
('AADHTEL006', 'R601', 'Lake Palace Suite', 'Magnificent 700 sq ft suite with Lake Pichola views', 16500.00, 'Lake View', 'Available', NULL, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200', NULL, NULL),
('AADHTEL007', 'R701', 'Tech Suite', 'Modern 500 sq ft suite with smart home technology and IT park views', 10000.00, 'City View', 'Available', NULL, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', NULL, NULL),
('AADHTEL008', 'R801', 'Houseboat Room', 'Traditional 450 sq ft houseboat room with backwater views', 11000.00, 'Backwater View', 'Available', NULL, 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200', NULL, NULL),
('AADHTEL009', 'R901', 'Business Suite', 'Efficient 480 sq ft suite with co-working space', 7500.00, 'IT Park View', 'Available', NULL, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', NULL, NULL),
('AADHTEL010', 'R1001', 'Desert Villa', 'Luxury 750 sq ft villa with private pool and dune views', 13000.00, 'Sand Dune View', 'Available', NULL, 'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=1200', NULL, NULL),
('AADHTEL011', 'R1101', 'Riverside Cottage', 'Spiritual 500 sq ft cottage with Ganges river views', 10000.00, 'River View', 'Available', NULL, 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200', NULL, NULL),
('AADHTEL012', 'R1201', 'Heritage Room', 'Elegant 400 sq ft colonial room with heritage furnishings', 9500.00, 'Street View', 'Available', NULL, 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200', NULL, NULL),
('AADHTEL013', 'R1301', 'Plantation Suite', 'Charming 550 sq ft suite with coffee estate views', 11000.00, 'Plantation View', 'Available', NULL, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', NULL, NULL),
('AADHTEL014', 'R1401', 'Tech Studio', 'Contemporary 420 sq ft suite with tech amenities', 8500.00, 'Mountain View', 'Available', NULL, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1200', NULL, NULL),
('AADHTEL015', 'R1501', 'Lake View Suite', 'Charming 480 sq ft suite with panoramic lake views', 11000.00, 'Lake View', 'Available', NULL, 'https://images.unsplash.com/photo-1549294413-26f195200c16?w=1200', NULL, NULL);

-- =============================================
-- Insert Hotel Amenities - Note: correct table name and field names
-- =============================================
INSERT INTO Hotel_Amenities (HotelID, AmenityID, Is_Available, Additional_Info) VALUES
('AADHTEL001', 1, TRUE, 'High-speed fiber optic network'),
('AADHTEL001', 2, TRUE, 'Complimentary valet parking'),
('AADHTEL001', 3, TRUE, 'Olympic-size infinity pool'),
('AADHTEL001', 4, TRUE, '24/7 fitness center'),
('AADHTEL001', 5, TRUE, 'Six specialty restaurants'),
('AADHTEL002', 1, TRUE, 'Free WiFi throughout property'),
('AADHTEL002', 2, TRUE, 'Limited parking available'),
('AADHTEL002', 8, TRUE, 'Smart TV in all rooms'),
('AADHTEL003', 3, TRUE, 'Three temperature-controlled pools'),
('AADHTEL003', 4, TRUE, 'Beach fitness zone'),
('AADHTEL003', 15, TRUE, 'Daily airport shuttles'),
('AADHTEL004', 1, TRUE, 'Gigabit internet speeds'),
('AADHTEL004', 5, TRUE, 'Six specialty restaurants');

-- =============================================
-- Insert Bookings (Sample bookings) - Note: Checkin_Date not CheckinDate, etc.
-- =============================================
INSERT INTO Booking (CustomerID, HotelID, RoomID, Checkin_Date, Checkout_Date, Base_Amount, Tax_Amount, Booking_Status, Booking_Date) VALUES
('CUST00000001', 'AADHTEL001', 'R101', '2025-02-15', '2025-02-18', 25500.00, 4590.00, TRUE, '2025-01-20 10:30:00'),
('CUST00000002', 'AADHTEL002', 'R201', '2025-02-20', '2025-02-24', 60000.00, 10800.00, TRUE, '2025-01-25 14:15:00'),
('CUST00000003', 'AADHTEL003', 'R302', '2025-03-01', '2025-03-05', 38000.00, 6840.00, TRUE, '2025-02-01 09:45:00'),
('CUST00000004', 'AADHTEL004', 'R402', '2025-03-10', '2025-03-13', 36000.00, 6480.00, TRUE, '2025-02-10 11:20:00'),
('CUST00000005', 'AADHTEL005', 'R501', '2025-03-15', '2025-03-18', 27000.00, 4860.00, TRUE, '2025-02-15 16:30:00'),
('CUST00000006', 'AADHTEL006', 'R601', '2025-03-20', '2025-03-24', 66000.00, 11880.00, TRUE, '2025-02-20 13:00:00'),
('CUST00000007', 'AADHTEL007', 'R701', '2025-03-25', '2025-03-28', 30000.00, 5400.00, TRUE, '2025-02-25 10:45:00'),
('CUST00000008', 'AADHTEL008', 'R801', '2025-04-01', '2025-04-05', 44000.00, 7920.00, TRUE, '2025-03-01 15:15:00'),
('CUST00000009', 'AADHTEL009', 'R901', '2025-04-05', '2025-04-08', 22500.00, 4050.00, TRUE, '2025-03-05 12:30:00'),
('CUST00000010', 'AADHTEL010', 'R1001', '2025-04-10', '2025-04-13', 39000.00, 7020.00, TRUE, '2025-03-10 14:00:00'),
('CUST00000011', 'AADHTEL011', 'R1101', '2025-04-15', '2025-04-18', 30000.00, 5400.00, TRUE, '2025-03-15 10:20:00'),
('CUST00000012', 'AADHTEL012', 'R1201', '2025-04-20', '2025-04-23', 28500.00, 5130.00, TRUE, '2025-03-20 16:45:00'),
('CUST00000013', 'AADHTEL013', 'R1301', '2025-04-25', '2025-04-28', 33000.00, 5940.00, TRUE, '2025-03-25 11:00:00'),
('CUST00000014', 'AADHTEL014', 'R1401', '2025-05-01', '2025-05-04', 25500.00, 4590.00, TRUE, '2025-04-01 09:30:00'),
('CUST00000015', 'AADHTEL015', 'R1501', '2025-05-05', '2025-05-08', 33000.00, 5940.00, TRUE, '2025-04-05 13:15:00');

-- =============================================
-- Insert Sample Reviews - Note: Hotel_Review not HotelReview, Hotel_Rating not HotelRating, etc.
-- =============================================
INSERT INTO Customer_Hotel_Review (CustomerID, HotelID, Hotel_Review, Hotel_Rating, Hotel_Score, Review_Date) VALUES
('CUST00000001', 'AADHTEL001', 'Exceptional experience! The Grand Bangalore Palace exceeded expectations with outstanding service and luxury amenities.', 4.8, 96, '2025-02-19 10:30:00'),
('CUST00000002', 'AADHTEL002', 'Beautiful heritage property! The restoration work is impeccable and staff are incredibly courteous and knowledgeable.', 4.7, 94, '2025-02-25 14:20:00'),
('CUST00000003', 'AADHTEL003', 'Paradise on earth! The beach villa was stunning with direct sand access and professional staff service.', 4.9, 98, '2025-03-06 11:45:00'),
('CUST00000004', 'AADHTEL004', 'Perfect for business travelers! Modern amenities and great location with efficient service.', 4.6, 92, '2025-03-14 15:30:00'),
('CUST00000005', 'AADHTEL005', 'Serene mountain getaway! Stunning Himalayan views and excellent hospitality made my stay memorable.', 4.7, 94, '2025-03-19 12:00:00'),
('CUST00000006', 'AADHTEL006', 'Truly regal experience! Lake Palace Udaipur is magnificent with exceptional cultural immersion and service.', 4.9, 98, '2025-03-25 16:20:00'),
('CUST00000007', 'AADHTEL007', 'Tech hub excellence! Ultra-modern facilities and perfect for IT professionals visiting Hyderabad.', 4.5, 90, '2025-03-29 10:15:00'),
('CUST00000008', 'AADHTEL008', 'Magical backwater experience! Houseboat stay was unique and the nature immersion was incredible.', 4.8, 96, '2025-04-06 13:45:00'),
('CUST00000009', 'AADHTEL009', 'Great business hotel! Excellent co-working facilities and perfect location for corporate travelers.', 4.5, 90, '2025-04-09 14:30:00'),
('CUST00000010', 'AADHTEL010', 'Desert magic! The luxury tents and camel safaris created an unforgettable Rajasthani experience.', 4.8, 96, '2025-04-14 11:20:00'),
('CUST00000011', 'AADHTEL011', 'Spiritual haven! Perfect blend of luxury and meditation with the Ganges as your backdrop.', 4.7, 94, '2025-04-19 15:45:00'),
('CUST00000012', 'AADHTEL012', 'Colonial elegance! Stepping into this heritage property feels like time travel to the Raj era.', 4.8, 96, '2025-04-24 10:30:00'),
('CUST00000013', 'AADHTEL013', 'Coffee plantation paradise! Learning about coffee cultivation and staying amidst plantations was exceptional.', 4.6, 92, '2025-04-29 16:15:00'),
('CUST00000014', 'AADHTEL014', 'Tech-forward hotel! Modern design meets excellent service in Pune''s IT hub.', 4.5, 90, '2025-05-05 12:00:00'),
('CUST00000015', 'AADHTEL015', 'Lakeside charm! Beautiful colonial property with stunning Naini Lake views and warm hospitality.', 4.7, 94, '2025-05-09 14:45:00');

-- =============================================
-- Insert Sample Room Reviews - Note: Room_Review not RoomReview, Room_Rating not RoomRating, etc.
-- =============================================
INSERT INTO Customer_Room_Review (CustomerID, HotelID, RoomID, Room_Review, Room_Rating, Room_Score, Review_Date) VALUES
('CUST00000001', 'AADHTEL001', 'R101', 'Spacious and luxurious with impeccable cleanliness. The bed was incredibly comfortable and city views were stunning.', 4.9, 98, '2025-02-19 10:30:00'),
('CUST00000002', 'AADHTEL002', 'R201', 'Authentic Rajasthani suite with modern comforts. Loved the traditional furnishings and courtyard views from the jharokha.', 4.8, 96, '2025-02-25 14:20:00'),
('CUST00000003', 'AADHTEL003', 'R302', 'Amazing ocean views! The suite was spacious, clean, and had all amenities. Direct beach access was perfect.', 4.9, 98, '2025-03-06 11:45:00'),
('CUST00000004', 'AADHTEL004', 'R402', 'Executive suite met all business needs with excellent workspace and comfortable bed. Great for working and relaxing.', 4.6, 92, '2025-03-14 15:30:00'),
('CUST00000005', 'AADHTEL005', 'R501', 'Cozy mountain room with fireplace and amazing Himalayan views. Perfect for cold mountain evenings.', 4.7, 94, '2025-03-19 12:00:00'),
('CUST00000006', 'AADHTEL006', 'R601', 'Absolutely stunning Lake Palace suite! Best views in Udaipur with luxury amenities and romantic ambiance.', 4.9, 98, '2025-03-25 16:20:00'),
('CUST00000007', 'AADHTEL007', 'R701', 'Modern tech suite with smart home features. Perfect for remote work with excellent connectivity and comfort.', 4.6, 92, '2025-03-29 10:15:00'),
('CUST00000008', 'AADHTEL008', 'R801', 'Unique houseboat experience! Traditional design with modern bathrooms. Felt authentic and magical.', 4.8, 96, '2025-04-06 13:45:00'),
('CUST00000009', 'AADHTEL009', 'R901', 'Efficient business suite with co-working setup. Great for productivity with reliable high-speed internet.', 4.5, 90, '2025-04-09 14:30:00'),
('CUST00000010', 'AADHTEL010', 'R1001', 'Desert villa with private pool was incredible! Luxury in the middle of sand dunes with stunning sunset views.', 4.8, 96, '2025-04-14 11:20:00'),
('CUST00000011', 'AADHTEL011', 'R1101', 'Riverside cottage with spiritual vibes. Morning Ganga aarti views from room and peaceful meditation atmosphere.', 4.7, 94, '2025-04-19 15:45:00'),
('CUST00000012', 'AADHTEL012', 'R1201', 'Heritage room transports you to colonial era. Authentic furnishings with modern comforts. Wonderful experience.', 4.8, 96, '2025-04-24 10:30:00'),
('CUST00000013', 'AADHTEL013', 'R1301', 'Plantation suite with coffee estate views. Woke up to plantation vistas and fresh mountain air. Simply magical.', 4.6, 92, '2025-04-29 16:15:00'),
('CUST00000014', 'AADHTEL014', 'R1401', 'Contemporary tech studio with all smart features. Comfortable bed and efficient workspace for professionals.', 4.5, 90, '2025-05-05 12:00:00'),
('CUST00000015', 'AADHTEL015', 'R1501', 'Lake view suite with colonial charm. Beautiful room with stunning Naini Lake views and excellent service.', 4.8, 96, '2025-05-09 14:45:00');

-- =============================================
-- Insert Room Amenities (Sample)
-- =============================================
INSERT INTO Room_Amenities (HotelID, RoomID, AmenityID, Is_Available, Additional_Info) VALUES
('AADHTEL001', 'R101', 1, TRUE, 'High-speed WiFi'),
('AADHTEL001', 'R101', 7, TRUE, 'Central AC with smart controls'),
('AADHTEL001', 'R101', 8, TRUE, '55-inch smart TV'),
('AADHTEL002', 'R201', 1, TRUE, 'Free WiFi'),
('AADHTEL002', 'R201', 7, TRUE, 'Air conditioning'),
('AADHTEL003', 'R302', 1, TRUE, 'High-speed WiFi'),
('AADHTEL003', 'R302', 9, TRUE, 'Well-stocked mini bar'),
('AADHTEL003', 'R302', 10, TRUE, 'Private beachfront balcony'),
('AADHTEL004', 'R402', 1, TRUE, 'Gigabit internet'),
('AADHTEL004', 'R402', 7, TRUE, 'Smart climate control'),
('AADHTEL005', 'R501', 1, TRUE, 'WiFi connectivity'),
('AADHTEL005', 'R501', 7, TRUE, 'Central heating');

-- =============================================
-- Update Customer Total_Bookings
-- =============================================
UPDATE Customer SET Total_Bookings = (
  SELECT COUNT(*) FROM Booking WHERE Booking.CustomerID = Customer.CustomerID
);

-- =============================================
-- Update Hotel Overall Ratings and Scores (Average of reviews)
-- =============================================
UPDATE Hotel SET Overall_Rating = (
  SELECT AVG(Hotel_Rating) FROM Customer_Hotel_Review 
  WHERE Customer_Hotel_Review.HotelID = Hotel.HotelID
), Overall_Score = (
  SELECT ROUND(AVG(Hotel_Score)) FROM Customer_Hotel_Review 
  WHERE Customer_Hotel_Review.HotelID = Hotel.HotelID
) WHERE HotelID IN (
  SELECT DISTINCT HotelID FROM Customer_Hotel_Review
);

-- =============================================
-- Update Room Overall Ratings and Scores (Average of reviews)
-- =============================================
UPDATE Room SET Overall_Rating = (
  SELECT AVG(Room_Rating) FROM Customer_Room_Review 
  WHERE Customer_Room_Review.HotelID = Room.HotelID 
  AND Customer_Room_Review.RoomID = Room.RoomID
), Overall_Score = (
  SELECT ROUND(AVG(Room_Score)) FROM Customer_Room_Review 
  WHERE Customer_Room_Review.HotelID = Room.HotelID 
  AND Customer_Room_Review.RoomID = Room.RoomID
) WHERE (HotelID, RoomID) IN (
  SELECT DISTINCT HotelID, RoomID FROM Customer_Room_Review
);
