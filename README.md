# Nestoria Inc. - Hotel Booking Platform

A full-stack hotel booking web application built with PostgreSQL, Node.js/Express, and React. Features dual authentication systems (Customers & Hosts), complete CRUD operations, Firebase & Supabase integration for file storage, and production-ready deployment configuration.

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
- ☁️ Cloud storage integration (Firebase & Supabase)
- 🚀 Production deployment on Render.com
- 🔄 CORS configuration for cross-origin requests

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL 14+ with pg driver
- **Authentication:** JWT (jsonwebtoken), bcryptjs
- **Storage:** Firebase Admin SDK, Supabase
- **File Upload:** Multer
- **Other:** CORS, dotenv, body-parser

### Frontend

- **Library:** React 18.2
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Date Handling:** date-fns, react-datepicker
- **Icons:** react-icons
- **Storage:** Firebase
- **Build Tool:** Create React App (react-scripts)
- **Styling:** Custom CSS

### Database

- **Engine:** PostgreSQL 14+
- **Schema:** 10 tables with foreign key relationships
- **Features:** Indexes, triggers, cascade operations

## 🚀 Installation & Setup

### Prerequisites

- **Node.js** v16 or higher
- **PostgreSQL** v14 or higher
- **npm** or yarn package manager
- **Firebase** account (for image storage - optional)
- **Supabase** account (for alternative storage - optional)

### 1️⃣ Database Setup

1. **Create a PostgreSQL database:**

   ```bash
   createdb nestoria_db
   ```

2. **Run the schema to create all tables:**

   ```bash
   psql -d nestoria_db -f database/schema.sql
   ```

3. **Seed the database with sample data (optional):**

   ```bash
   psql -d nestoria_db -f database/seed.sql
   ```

4. **Add triggers (optional):**

   ```bash
   psql -d nestoria_db -f database/trigger.sql
   ```

5. **If using Supabase, run Supabase-specific setup:**
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

   # Optional: Supabase configuration
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Optional: Firebase configuration (handled via firebase.js)
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

### 4️⃣ File Storage Setup (Optional)

**Firebase Setup:**

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Storage in Firebase Console
3. Download service account key JSON
4. Update `backend/config/firebase.js` with your credentials
5. Update `frontend/src/config/firebase.js` with your web app config

**Supabase Setup:**

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a storage bucket for images
3. Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to backend `.env`
4. Update `backend/config/supabase.js` if needed

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
- **Hotel** - Hotel properties with ratings and images
- **Room** - Individual rooms with composite key (HotelID, RoomID)
- **Amenities** - Master list of available amenities
- **Hotel_Amenities** - Junction table for hotel amenities
- **Room_Amenities** - Junction table for room amenities
- **Booking** - Booking transactions with date ranges
- **Customer_Hotel_Review** - Hotel reviews and ratings
- **Customer_Room_Review** - Room reviews and ratings

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

   - Add `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (if using Supabase)
   - Add Firebase credentials (if using Firebase)
   - JWT_SECRET is auto-generated

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

## 🔧 Key Components

### Backend Controllers

- **authController.js**: Handles registration/login for customers and hosts
- **hotelController.js**: CRUD operations for hotels
- **roomController.js**: Room management with composite key support
- **bookingController.js**: Booking creation, cancellation, and retrieval
- **reviewController.js**: Hotel and room review system

### Frontend Pages

- **LoginSignup.jsx**: Dual authentication (Customer/Host)
- **Home.jsx**: Landing page with search
- **HotelsList.jsx**: Search results with filters
- **HotelDetails.jsx**: Hotel information and room listings
- **HostDashboard.jsx**: Host statistics and property management
- **CustomerProfile.jsx**: Booking history and profile

### Authentication Flow

1. User registers as Customer or Host
2. JWT token generated on login
3. Token stored in localStorage
4. AuthContext provides user state globally
5. ProtectedRoute guards authenticated pages
6. authMiddleware verifies JWT on backend

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
