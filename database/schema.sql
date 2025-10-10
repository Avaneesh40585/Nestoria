-- =============================================
-- Nestoria Inc. PostgreSQL Database Schema
-- =============================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Booking CASCADE;
DROP TABLE IF EXISTS Room_Amenities_Relation CASCADE;
DROP TABLE IF EXISTS Hotel_Amenities_Relation CASCADE;
DROP TABLE IF EXISTS Amenities CASCADE;
DROP TABLE IF EXISTS Room CASCADE;
DROP TABLE IF EXISTS Employee CASCADE;
DROP TABLE IF EXISTS Hotel CASCADE;
DROP TABLE IF EXISTS Host CASCADE;
DROP TABLE IF EXISTS Customer CASCADE;

-- =============================================
-- Core Entity Tables: Customer & Host
-- =============================================
CREATE TABLE Customer (
    CustomerID SERIAL PRIMARY KEY,
    Full_name VARCHAR(150) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE,
    Gender VARCHAR(10),
    Age INT,
    Address VARCHAR(255),
    Identity_No VARCHAR(12) UNIQUE,
    TotalBookings INT DEFAULT 0
);

CREATE TABLE Host (
    HostID SERIAL PRIMARY KEY,
    Full_name VARCHAR(150) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    PhoneNumber VARCHAR(15) UNIQUE,
    Gender VARCHAR(10),
    Age INT,
    Address VARCHAR(255),
    Identity_No VARCHAR(12) UNIQUE
);

-- =============================================
-- Hotel-Related Tables: Hotel, Room, Employee
-- =============================================
CREATE TABLE Hotel (
    HotelID SERIAL PRIMARY KEY,
    HostID INT,
    HotelName VARCHAR(100) NOT NULL,
    HotelAddress VARCHAR(255),
    Hoteldesc TEXT,
    Checkin_time TIME,
    Checkout_time TIME,
    ContactReceptionist VARCHAR(15),
    Reviews TEXT,
    OverallRating DECIMAL(2,1),
    HotelImg VARCHAR(255),
    FOREIGN KEY (HostID) REFERENCES Host(HostID) ON DELETE SET NULL
);

CREATE TABLE Employee (
    EmployeeID SERIAL PRIMARY KEY,
    HotelID INT,
    Name VARCHAR(100) NOT NULL,
    Role VARCHAR(50),
    Hiring_date DATE,
    Salaries DECIMAL(10,2),
    Status VARCHAR(20) DEFAULT 'active' CHECK (Status IN ('active', 'inactive')),
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE
);

CREATE TABLE Room (
    RoomID SERIAL PRIMARY KEY,
    HotelID INT,
    RoomNumber VARCHAR(10) NOT NULL,
    Room_type VARCHAR(50),
    Room_desc TEXT,
    Cost_per_night DECIMAL(10,2),
    Position_view VARCHAR(50),
    Room_Status VARCHAR(20),
    Room_Rating DECIMAL(2,1),
    Room_Review TEXT,
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE
);

-- =============================================
-- Amenities & Linking Tables
-- =============================================
CREATE TABLE Amenities (
    AmenityID SERIAL PRIMARY KEY,
    Amenity_name VARCHAR(100) NOT NULL,
    Amenity_desc TEXT
);

CREATE TABLE Hotel_Amenities_Relation (
    HotelID INT,
    AmenityID INT,
    Availability_hrs VARCHAR(50),
    PRIMARY KEY (HotelID, AmenityID),
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE,
    FOREIGN KEY (AmenityID) REFERENCES Amenities(AmenityID) ON DELETE CASCADE
);

CREATE TABLE Room_Amenities_Relation (
    RoomID INT,
    AmenityID INT,
    Working_Status BOOLEAN DEFAULT TRUE,
    PRIMARY KEY (RoomID, AmenityID),
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID) ON DELETE CASCADE,
    FOREIGN KEY (AmenityID) REFERENCES Amenities(AmenityID) ON DELETE CASCADE
);

-- =============================================
-- Transactional Table: Booking
-- =============================================
CREATE TABLE Booking (
    BookingID SERIAL PRIMARY KEY,
    CustomerID INT,
    RoomID INT,
    ReceptionistID INT,
    TransactionID VARCHAR(255) UNIQUE,
    checkin_date DATE NOT NULL,
    checkout_date DATE NOT NULL,
    base_amount DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    final_amount DECIMAL(10,2),
    booking_status BOOLEAN,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE SET NULL,
    FOREIGN KEY (RoomID) REFERENCES Room(RoomID) ON DELETE SET NULL,
    FOREIGN KEY (ReceptionistID) REFERENCES Employee(EmployeeID) ON DELETE SET NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_hotel_address ON Hotel(HotelAddress);
CREATE INDEX idx_room_hotelid ON Room(HotelID);
CREATE INDEX idx_booking_customerid ON Booking(CustomerID);
CREATE INDEX idx_booking_roomid ON Booking(RoomID);
CREATE INDEX idx_booking_dates ON Booking(checkin_date, checkout_date);
