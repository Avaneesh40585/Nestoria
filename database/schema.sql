-- =============================================
-- Core Entity Tables: Customer & Host
-- =============================================
CREATE TABLE Customer (
    CustomerID VARCHAR(12) PRIMARY KEY,
    Full_Name VARCHAR(150) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    Phone_Number VARCHAR(15) UNIQUE,
    Gender VARCHAR(10),
    Age INT,
    Address VARCHAR(255),
    Total_Bookings INT DEFAULT 0
);

CREATE TABLE Host (
    HostID VARCHAR(12) PRIMARY KEY,
    Full_Name VARCHAR(150) NOT NULL,
    Email VARCHAR(100) NOT NULL UNIQUE,
    Password VARCHAR(100) NOT NULL,
    Phone_Number VARCHAR(15) UNIQUE,
    Gender VARCHAR(10),
    Age INT,
    Address VARCHAR(255)
);

-- =============================================
-- Hotel-Related Tables: Hotel, Room
-- =============================================
CREATE TABLE Hotel (
    HotelID VARCHAR(12) PRIMARY KEY,
    HostID VARCHAR(12),
    Hotel_Name VARCHAR(100) NOT NULL,
    Hotel_Address VARCHAR(255),
    Hotel_Description TEXT,
    Checkin_Time TIME,
    Checkout_Time TIME,
    Receptionist_Number VARCHAR(15),
    Overall_Rating DECIMAL(2,1),
    Overall_Score INT,
    Hotel_Img TEXT,
    FOREIGN KEY (HostID) REFERENCES Host(HostID) ON DELETE SET NULL
);

CREATE TABLE Room (
    HotelID VARCHAR(12),
    RoomID VARCHAR(10),
    Room_Type VARCHAR(50),
    Room_Description TEXT,
    Cost_Per_Night DECIMAL(10,2),
    Position_View VARCHAR(50),
    Room_Status VARCHAR(20),
    Room_Review TEXT,
    Room_Img TEXT,
    Overall_Rating DECIMAL(2,1),
    Overall_Score INT,
    PRIMARY KEY (HotelID, RoomID),
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE
);

-- =============================================
-- Amenities Table
-- =============================================
CREATE TABLE Amenities (
    AmenityID SERIAL PRIMARY KEY,
    Amenity_Name VARCHAR(100) NOT NULL
);

-- =============================================
-- Amenity Junction Tables
-- =============================================
CREATE TABLE Hotel_Amenities (
    HotelID VARCHAR(12),
    AmenityID INT,
    Is_Available BOOLEAN DEFAULT TRUE,
    Additional_Info TEXT,
    PRIMARY KEY (HotelID, AmenityID),
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE,
    FOREIGN KEY (AmenityID) REFERENCES Amenities(AmenityID) ON DELETE CASCADE
);

CREATE TABLE Room_Amenities (
    HotelID VARCHAR(12),
    RoomID VARCHAR(10),
    AmenityID INT,
    Is_Available BOOLEAN DEFAULT TRUE,
    Additional_Info TEXT,
    PRIMARY KEY (HotelID, RoomID, AmenityID),
    FOREIGN KEY (HotelID, RoomID) REFERENCES Room(HotelID, RoomID) ON DELETE CASCADE,
    FOREIGN KEY (AmenityID) REFERENCES Amenities(AmenityID) ON DELETE CASCADE
);

-- =============================================
-- Transactional Table: Booking
-- =============================================
CREATE TABLE Booking (
    BookingID SERIAL PRIMARY KEY,
    CustomerID VARCHAR(12),
    HotelID VARCHAR(12),
    RoomID VARCHAR(10),
    Checkin_Date DATE NOT NULL,
    Checkout_Date DATE NOT NULL,
    Base_Amount DECIMAL(10,2),
    Tax_Amount DECIMAL(10,2),
    Booking_Status BOOLEAN,
    Booking_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE SET NULL,
    FOREIGN KEY (HotelID, RoomID) REFERENCES Room(HotelID, RoomID) ON DELETE SET NULL
);

-- =============================================
-- Review & Rating Tables
-- =============================================
CREATE TABLE Customer_Hotel_Review (
    CustomerID VARCHAR(12),
    HotelID VARCHAR(12),
    Hotel_Review TEXT,
    Hotel_Rating DECIMAL(2,1),
    Hotel_Score INT,
    Review_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (CustomerID, HotelID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    FOREIGN KEY (HotelID) REFERENCES Hotel(HotelID) ON DELETE CASCADE
);

CREATE TABLE Customer_Room_Review (
    CustomerID VARCHAR(12),
    HotelID VARCHAR(12),
    RoomID VARCHAR(10),
    Room_Review TEXT,
    Room_Rating DECIMAL(2,1),
    Room_Score INT,
    Review_Date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (CustomerID, HotelID, RoomID),
    FOREIGN KEY (CustomerID) REFERENCES Customer(CustomerID) ON DELETE CASCADE,
    FOREIGN KEY (HotelID, RoomID) REFERENCES Room(HotelID, RoomID) ON DELETE CASCADE
);

-- =============================================
-- Indexes for Performance Optimization
-- =============================================
CREATE INDEX idx_hotel_address ON Hotel(Hotel_Address);
CREATE INDEX idx_hotel_host ON Hotel(HostID);
CREATE INDEX idx_room_hotel ON Room(HotelID);
CREATE INDEX idx_booking_customer ON Booking(CustomerID);
CREATE INDEX idx_booking_room ON Booking(HotelID, RoomID);
CREATE INDEX idx_booking_dates ON Booking(Checkin_Date, Checkout_Date);
CREATE INDEX idx_customer_hotel_review_hotel ON Customer_Hotel_Review(HotelID);
CREATE INDEX idx_customer_room_review_room ON Customer_Room_Review(HotelID, RoomID);
CREATE INDEX idx_hotel_amenities_hotel ON Hotel_Amenities(HotelID);
CREATE INDEX idx_hotel_amenities_amenity ON Hotel_Amenities(AmenityID);
CREATE INDEX idx_room_amenities_room ON Room_Amenities(HotelID, RoomID);
CREATE INDEX idx_room_amenities_amenity ON Room_Amenities(AmenityID);