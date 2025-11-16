# Nestoria Inc. - Hotel Booking Platform

A full-stack hotel booking web application built with PostgreSQL, Node.js/Express, and React. Features dual authentication systems (Customers & Hosts), complete CRUD operations, Firebase & Supabase integration for file storage, and production-ready deployment configuration.

## 🆕 Recent Updates

- ✅ **Image Upload Optimization**: Automatic resizing to 1200×800px with 90% compression
- ✅ **Supabase Integration**: Primary storage solution with service role key support
- ✅ **Database Schema Updates**: TEXT columns for HotelImg and Room_img
- ✅ **Inline Editing**: Edit hotels, rooms, and profiles without page navigation
- ✅ **Enhanced Host Dashboard**: Tabbed interface with statistics and property management
- ✅ **Form UX Improvements**: Auto-hide forms after save, button placement optimizations
- ✅ **Windows Compatibility**: PowerShell-specific commands and troubleshooting
- ✅ **Review System**: Dedicated tables for hotel and room reviews

## 🏗️ Project Structure

```
Nestoria/
├── backend/                    # Node.js/Express API server
│   ├── config/                 # Configuration files
│   │   ├── database.js         # PostgreSQL connection pool
│   │   ├── firebase.js         # Firebase Admin SDK config
│   │   └── supabase.js         # Supabase client config
│   ├── controllers/            # Request handlers
│   │   ├── authController.js   # Authentication logic
│   │   ├── bookingController.js # Booking management
│   │   ├── customerController.js # Customer operations
│   │   ├── hostController.js   # Host operations & dashboard
│   │   ├── hotelController.js  # Hotel CRUD operations
│   │   ├── reviewController.js # Review system
│   │   └── roomController.js   # Room CRUD & availability
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification middleware
│   ├── routes/                 # API route definitions
│   │   ├── authRoutes.js       # /api/auth endpoints
│   │   ├── bookingRoutes.js    # /api/bookings endpoints
│   │   ├── customerRoutes.js   # /api/customers endpoints
│   │   ├── hostRoutes.js       # /api/hosts endpoints
│   │   ├── hotelRoutes.js      # /api/hotels endpoints
│   │   ├── reviewRoutes.js     # /api/reviews endpoints
│   │   ├── roomRoutes.js       # /api/rooms endpoints
│   │   └── uploadRoutes.js     # /api/upload endpoints
│   ├── services/
│   │   └── uploadService.js    # File upload to Firebase/Supabase
│   ├── utils/
│   │   └── helpers.js          # Utility functions
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express app entry point
├── database/                   # Database schema & migrations
│   ├── schema.sql              # Complete database schema
│   ├── seed.sql                # Sample data for testing
│   ├── supabase.sql            # Supabase-specific setup
│   └── trigger.sql             # Database triggers
├── frontend/                   # React application
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── FilterBar.jsx   # Hotel search filters
│   │   │   ├── Footer.jsx      # Site footer
│   │   │   ├── HotelCard.jsx   # Hotel display card
│   │   │   ├── Navbar.jsx      # Navigation bar
│   │   │   ├── ProtectedRoute.jsx # Route authentication
│   │   │   ├── RoomCard.jsx    # Room display card
│   │   │   └── SearchBar.jsx   # Search interface
│   │   ├── config/
│   │   │   └── firebase.js     # Firebase client config
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state management
│   │   ├── pages/              # Application pages
│   │   │   ├── AboutUs.jsx     # About page
│   │   │   ├── AddRooms.jsx    # Add rooms interface (Host)
│   │   │   ├── BookingPage.jsx # Booking interface
│   │   │   ├── CompleteProfile.jsx # Profile completion
│   │   │   ├── CustomerProfile.jsx # Customer dashboard
│   │   │   ├── Home.jsx        # Landing page
│   │   │   ├── HostDashboard.jsx # Host dashboard & stats
│   │   │   ├── HostProfile.css # Host profile styles
│   │   │   ├── HostProfile.jsx # Host profile page
│   │   │   ├── HotelDetails.jsx # Hotel details view
│   │   │   ├── HotelsList.jsx  # Hotels search results
│   │   │   ├── LoginSignup.jsx # Auth pages
│   │   │   ├── RoomDetails.jsx # Room details view
│   │   │   └── TermsOfService.jsx # Terms page
│   │   ├── services/           # API integration
│   │   │   ├── api.js          # Axios instance & API calls
│   │   │   └── uploadAPI.js    # File upload API
│   │   ├── App.css             # Global styles
│   │   ├── App.jsx             # Main app component & routing
│   │   ├── index.css           # Root styles
│   │   └── index.js            # React entry point
│   └── package.json            # Frontend dependencies
├── LICENSE.txt                 # MIT License
├── README.md                   # This file
└── render.yaml                 # Render.com deployment config
```

## ✨ Features

### Customer Features

- 🔐 Secure registration and authentication
- 🔍 Search and filter hotels by location, price, and rating
- 🏨 View detailed hotel and room information with images
- 📅 Book rooms with date selection and availability checking
- 👤 Manage profile and view booking history
- ❌ Cancel bookings
- ⭐ Submit hotel and room reviews

### Host Features

- 🏢 Complete CRUD operations for hotels and rooms
- 📊 Dashboard with statistics (total bookings, revenue, properties)
- 📋 View all bookings for their properties
- 🛏️ Manage hotel and room amenities
- 📸 Upload hotel and room images via Firebase/Supabase
- 💼 Profile management

### Technical Features

- 🔒 JWT-based authentication with separate customer/host flows
- 🗄️ PostgreSQL database with comprehensive relational schema
- 🌐 RESTful API architecture with Express.js
- 📱 Responsive design with custom CSS
- ⚡ Real-time room availability checking
- ☁️ Cloud storage integration (Supabase primary, Firebase legacy)
- 🖼️ Automatic image optimization (max 1200×800px, 90% quality)
- 🚀 Production deployment on Render.com
- 🔄 CORS configuration for cross-origin requests
- 📋 Inline editing for host properties and profile
- 🎯 Tab-based navigation with state management

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL 14+ with pg driver (v8.16.3)
- **Authentication:** JWT (jsonwebtoken v9.0.2), bcryptjs (v3.0.3)
- **Storage:** Supabase JS (v2.81.1), Firebase Admin SDK (v13.6.0)
- **File Upload:** Multer (v2.0.2)
- **Other:** CORS, dotenv (v16.3.1), body-parser (v1.20.2)
- **Dev Tools:** nodemon (v3.0.1)

### Frontend

- **Library:** React 18.2
- **Routing:** React Router DOM v6.20.0
- **HTTP Client:** Axios (v1.6.2)
- **State Management:** React Context API
- **Date Handling:** date-fns (v2.30.0), react-datepicker (v4.16.0)
- **Icons:** react-icons (v4.12.0)
- **Storage:** Firebase (v12.6.0)
- **Build Tool:** Create React App (react-scripts v5.0.1)
- **Styling:** Custom CSS
- **Other:** @popperjs/core (v2.11.8)

### Database

- **Engine:** PostgreSQL 14+
- **Schema:** 10 tables with foreign key relationships
- **Features:** Indexes, triggers, cascade operations

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v16 or higher
- **PostgreSQL** v14 or higher
- **npm** or yarn package manager
- **Supabase** account (for image storage - **Required for image uploads**)
- **Firebase** account (for legacy support - optional)

### 1️⃣ Database Setup

1. **Create a PostgreSQL database:**

   ```bash
   createdb nestoria_db
   ```

2. **Run the schema to create all tables:**

   ```bash
   psql -d nestoria_db -f database/schema.sql
   ```

   **Windows PowerShell users:**
   ```powershell
   $env:PGPASSWORD='your_password'; psql -h localhost -p 5432 -U postgres -d nestoria_db -f database\schema.sql
   ```

3. **Seed the database with sample data (recommended for testing):**

   ```bash
   psql -d nestoria_db -f database/seed.sql
   ```

   **Windows PowerShell users:**
   ```powershell
   $env:PGPASSWORD='your_password'; psql -h localhost -p 5432 -U postgres -d nestoria_db -f database\seed.sql
   ```

   **Test Credentials (from seed data):**
   - Host accounts: Any seeded host email with password `Password123!`
   - Customer accounts: Created during registration

4. **Add triggers (optional):**

   ```bash
   psql -d nestoria_db -f database/trigger.sql
   ```

5. **Run Supabase-specific setup (if using Supabase):**
   ```bash
   psql -d nestoria_db -f database/supabase.sql
   ```

### 2️⃣ Backend Setup

1. **Navigate to backend directory:**

   ```bash
   cd backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file in the backend directory:**

   ```env
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=nestoria_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_key

   # Supabase configuration (REQUIRED for image uploads)
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   # Note: Use SERVICE_ROLE_KEY (not ANON_KEY) for backend operations

   # Optional: Firebase configuration (legacy support)
   ```

4. **Start the server:**

   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   ✅ Backend will run on `http://localhost:5000`

   Health check: `http://localhost:5000/api/health`

### 3️⃣ Frontend Setup

1. **Navigate to frontend directory:**

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Create `.env` file in the frontend directory:**

   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. **Configure Firebase (if using):**

   - Update `frontend/src/config/firebase.js` with your Firebase credentials

5. **Start the development server:**

   ```bash
   npm start
   ```

   ✅ Frontend will run on `http://localhost:3000`

### 4️⃣ File Storage Setup (Required for Image Uploads)

**Supabase Setup (Primary Storage):**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Navigate to **Storage** in the Supabase dashboard
3. Create a new **public** storage bucket named `hotel-images`
4. Go to **Settings → API** to find your credentials:
   - **Project URL** (SUPABASE_URL)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - **Not the anon key!**
5. Add these credentials to your backend `.env` file
6. Ensure the bucket has public access for image viewing

**Important Notes:**
- The **SERVICE_ROLE_KEY** is required for backend upload operations
- The **anon key** is insufficient for admin operations
- Images are automatically resized to max 1200×800px and compressed to 90% quality
- Supported formats: JPEG, PNG, WebP

**Firebase Setup (Optional - Legacy Support):**

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Storage in Firebase Console
3. Download service account key JSON
4. Update `backend/config/firebase.js` with your credentials
5. Update `frontend/src/config/firebase.js` with your web app config

## 📡 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint                  | Description           | Auth Required |
| ------ | ------------------------- | --------------------- | ------------- |
| POST   | `/auth/register/customer` | Register new customer | ❌            |
| POST   | `/auth/register/host`     | Register new host     | ❌            |
| POST   | `/auth/login/customer`    | Customer login        | ❌            |
| POST   | `/auth/login/host`        | Host login            | ❌            |

### Hotels (`/api/hotels`)

| Method | Endpoint               | Description                | Auth Required |
| ------ | ---------------------- | -------------------------- | ------------- |
| GET    | `/hotels/search`       | Search hotels with filters | ❌            |
| GET    | `/hotels/:id`          | Get hotel details          | ❌            |
| GET    | `/hotels/host/:hostId` | Get all hotels by host     | ✅ Host       |
| POST   | `/hotels`              | Create new hotel           | ✅ Host       |
| PUT    | `/hotels/:id`          | Update hotel               | ✅ Host       |
| DELETE | `/hotels/:id`          | Delete hotel               | ✅ Host       |

### Rooms (`/api/rooms`)

| Method | Endpoint                               | Description               | Auth Required |
| ------ | -------------------------------------- | ------------------------- | ------------- |
| GET    | `/rooms/:hotelId/:roomId`              | Get room details          | ❌            |
| GET    | `/rooms/:hotelId/:roomId/availability` | Check availability        | ❌            |
| GET    | `/rooms/hotel/:hotelId`                | Get all rooms for a hotel | ❌            |
| POST   | `/rooms`                               | Create new room           | ✅ Host       |
| PUT    | `/rooms/:hotelId/:roomId`              | Update room               | ✅ Host       |
| DELETE | `/rooms/:hotelId/:roomId`              | Delete room               | ✅ Host       |

### Bookings (`/api/bookings`)

| Method | Endpoint                 | Description                            | Auth Required |
| ------ | ------------------------ | -------------------------------------- | ------------- |
| POST   | `/bookings`              | Create new booking                     | ✅ Customer   |
| GET    | `/bookings/my-bookings`  | Get customer's bookings                | ✅ Customer   |
| GET    | `/bookings/host/:hostId` | Get all bookings for host's properties | ✅ Host       |
| PUT    | `/bookings/:id/cancel`   | Cancel booking                         | ✅ Customer   |

### Customer Profile (`/api/customers`)

| Method | Endpoint             | Description             | Auth Required |
| ------ | -------------------- | ----------------------- | ------------- |
| GET    | `/customers/profile` | Get customer profile    | ✅ Customer   |
| PUT    | `/customers/profile` | Update customer profile | ✅ Customer   |

### Host Profile & Dashboard (`/api/hosts`)

| Method | Endpoint                 | Description         | Auth Required |
| ------ | ------------------------ | ------------------- | ------------- |
| GET    | `/hosts/profile`         | Get host profile    | ✅ Host       |
| PUT    | `/hosts/profile`         | Update host profile | ✅ Host       |
| GET    | `/hosts/dashboard/stats` | Get host statistics | ✅ Host       |

### Reviews (`/api/reviews`)

| Method | Endpoint                         | Description         | Auth Required |
| ------ | -------------------------------- | ------------------- | ------------- |
| POST   | `/reviews/hotel`                 | Submit hotel review | ✅ Customer   |
| POST   | `/reviews/room`                  | Submit room review  | ✅ Customer   |
| GET    | `/reviews/hotel/:hotelId`        | Get hotel reviews   | ❌            |
| GET    | `/reviews/room/:hotelId/:roomId` | Get room reviews    | ❌            |

### Upload (`/api/upload`)

| Method | Endpoint        | Description                       | Auth Required |
| ------ | --------------- | --------------------------------- | ------------- |
| POST   | `/upload/image` | Upload image to Firebase/Supabase | ✅            |

### Health Check

| Method | Endpoint      | Description         | Auth Required |
| ------ | ------------- | ------------------- | ------------- |
| GET    | `/api/health` | Server health check | ❌            |

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with 10 main tables:

- **Customer** - Customer account information
- **Host** - Host account information
- **Hotel** - Hotel properties with ratings and images (HotelImg as TEXT)
- **Room** - Individual rooms with composite key (HotelID, RoomID) and Room_img column for images
- **Amenities** - Master list of available amenities
- **Hotel_Amenities** - Junction table for hotel amenities
- **Room_Amenities** - Junction table for room amenities
- **Booking** - Booking transactions with date ranges
- **Customer_Hotel_Review** - Hotel reviews and ratings (separate table, not text field)
- **Customer_Room_Review** - Room reviews and ratings (separate table, not text field)

Key relationships:

- One Host can own multiple Hotels
- One Hotel can have multiple Rooms
- Rooms use composite primary keys (HotelID, RoomID)
- Cascading deletes ensure data integrity
- Indexes on foreign keys and search columns for performance

## 🚀 Deployment

The project is configured for deployment on **Render.com** using the included `render.yaml` file.

### Deployment Configuration:

**Backend Service:**

- Type: Web Service (Node.js)
- Build: `cd backend && npm install`
- Start: `cd backend && npm start`
- Health Check: `/api/health`
- Auto-configured environment variables from PostgreSQL database

**Frontend Service:**

- Type: Static Site
- Build: `cd frontend && npm install && npm run build`
- Publish: `./frontend/build`
- SPA routing configured with rewrites

**Database:**

- PostgreSQL database on Render
- Free tier available
- Automatic connection to backend service

### To Deploy:

1. **Push to GitHub:**

   ```bash
   git push origin main
   ```

2. **Connect to Render:**

   - Create account at [render.com](https://render.com)
   - Create new Blueprint instance
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`

3. **Configure Environment Variables:**

   - Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (**required for image uploads**)
   - Ensure SERVICE_ROLE_KEY is used (not anon key)
   - Add Firebase credentials (optional, for legacy support)
   - JWT_SECRET is auto-generated
   - Add `REACT_APP_API_URL` for frontend

4. **Deploy:**
   - Render will automatically build and deploy both services
   - Database will be provisioned and connected

## 🧪 Development Scripts

### Backend

```bash
npm start       # Start production server
npm run dev     # Start with nodemon (auto-reload)
```

### Frontend

```bash
npm start       # Start development server
npm run build   # Create production build
npm test        # Run tests
```

## 📌 Important Notes

### Image Storage Requirements
- **Supabase is required** for image upload functionality to work
- Must use **SERVICE_ROLE_KEY** (not anon key) in backend `.env`
- Create a public bucket named exactly `hotel-images` in Supabase Storage
- Images are automatically optimized (max 1200×800px, 90% quality)

### Database Considerations
- Image columns (HotelImg, Room_img) are TEXT type to support large image URLs
- Reviews stored in dedicated tables (Customer_Hotel_Review, Customer_Room_Review)
- Composite keys used for rooms (HotelID, RoomID)
- Cascading deletes ensure referential integrity

### Windows Development
- Use PowerShell syntax for environment variables: `$env:VARIABLE='value'`
- May need to set execution policy: `Set-ExecutionPolicy RemoteSigned`
- Use backslashes for file paths in commands: `database\schema.sql`

### Authentication
- Separate JWT flows for customers and hosts
- Test credentials from seed data: email with password `Password123!`
- Tokens stored in localStorage with 24-hour expiry

### UI/UX Patterns
- Inline editing for host properties and profiles
- Forms auto-hide after successful save
- Tab-based navigation with state persistence
- Save/Cancel buttons in header area with icons

## 🔧 Key Components

### Backend Controllers

- **authController.js**: Handles registration/login for customers and hosts
- **hotelController.js**: CRUD operations for hotels with image upload support
- **roomController.js**: Room management with composite key support and image handling
- **bookingController.js**: Booking creation, cancellation, and retrieval
- **reviewController.js**: Hotel and room review system (dedicated tables)
- **customerController.js**: Customer profile management
- **hostController.js**: Host profile and dashboard statistics

### Backend Services

- **uploadService.js**: Handles image uploads to Supabase/Firebase with automatic resizing (1200×800px max, 90% quality)

### Frontend Pages

- **LoginSignup.jsx**: Dual authentication (Customer/Host)
- **Home.jsx**: Landing page with search
- **HotelsList.jsx**: Search results with filters
- **HotelDetails.jsx**: Hotel information and room listings
- **RoomDetails.jsx**: Individual room details with booking interface
- **HostDashboard.jsx**: Tabbed dashboard with hotels, rooms, bookings, and inline editing
- **HostProfile.jsx**: Host profile management with inline edit pattern
- **CustomerProfile.jsx**: Booking history and profile management
- **BookingPage.jsx**: Booking interface with date selection
- **CompleteProfile.jsx**: Profile completion flow
- **AboutUs.jsx**: About page with team information
- **TermsOfService.jsx**: Terms and conditions
- **AddRooms.jsx**: Room creation interface for hosts

### Authentication Flow

1. User registers as Customer or Host
2. JWT token generated on login
3. Token stored in localStorage
4. AuthContext provides user state globally
5. ProtectedRoute guards authenticated pages
6. authMiddleware verifies JWT on backend

## 🐞 Troubleshooting

### Common Issues

**Windows PowerShell Execution Policy:**
If you encounter script execution errors when running npm commands:
```powershell
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Run this in an elevated PowerShell window.

**Port Already in Use (EADDRINUSE):**
Before restarting the backend:
1. Check for processes using port 5000
2. Terminate any existing Node.js processes
3. Use Task Manager or command: `netstat -ano | findstr :5000`

**Database Connection Issues:**
- Verify PostgreSQL service is running
- Check credentials in `.env` file
- Ensure `nestoria_db` database exists
- For Windows, use PowerShell syntax for psql commands with `$env:PGPASSWORD`

**Image Upload Failures:**
- Verify you're using `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Check Supabase bucket name is exactly `hotel-images`
- Ensure bucket has public access enabled
- Verify bucket policies in Supabase dashboard

**Database Schema Issues:**
- If HotelImg or Room_img columns fail, ensure they're defined as `TEXT` (not VARCHAR)
- To reset database:
  ```powershell
  # Terminate connections
  psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='nestoria_db';"
  # Drop and recreate
  dropdb nestoria_db
  createdb nestoria_db
  # Re-run schema and seed
  $env:PGPASSWORD='your_password'; psql -h localhost -p 5432 -U postgres -d nestoria_db -f database\schema.sql
  $env:PGPASSWORD='your_password'; psql -h localhost -p 5432 -U postgres -d nestoria_db -f database\seed.sql
  ```

**Form Visibility Issues:**
- Forms should auto-hide after successful save
- Only appear when triggered by action buttons
- Check browser console for React state errors

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the `LICENSE.txt` file for details.

## 📧 Support

For issues and questions:

- **Email:** support@nestoria.com
- **GitHub Issues:** [Create an issue](https://github.com/Avaneesh40585/Nestoria/issues)

## 👥 Authors

- **Avaneesh** - Initial work - [Avaneesh40585](https://github.com/Avaneesh40585)

## 🙏 Acknowledgments

- Built as a demonstration of full-stack development with PostgreSQL
- Implements industry-standard practices for authentication and data modeling
- Designed for educational purposes and portfolio projects
- Uses modern React patterns (Hooks, Context API)
- RESTful API design following best practices
