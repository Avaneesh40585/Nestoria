# Nestoria Inc. - Hotel Booking Platform

A full-stack hotel booking web application built with PostgreSQL, Node.js/Express, and React.

## Features

- **Customer Features:**
  - Search and filter hotels by location, price, and rating
  - View detailed hotel and room information
  - Book rooms with date selection
  - Manage profile and view booking history
  - Cancel bookings

- **Host Features:**
  - Complete CRUD operations for hotels and rooms
  - Dashboard with statistics
  - View all bookings for their properties
  - Manage hotel amenities

- **Technical Features:**
  - JWT authentication
  - PostgreSQL database with full relational schema
  - RESTful API architecture
  - Responsive design
  - Real-time availability checking

## Tech Stack

- **Backend:** Node.js, Express.js, PostgreSQL, JWT
- **Frontend:** React, React Router, Axios
- **Database:** PostgreSQL 14+
- **Styling:** Custom CSS with modern design

## Installation

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Database Setup

1. Create a PostgreSQL database:
createdb nestoria_db

2. Run the schema:
psql -d nestoria_db -f database/schema.sql

3. Seed the database:
psql -d nestoria_db -f database/seed.sql


### Backend Setup

1. Navigate to backend directory:
cd backend

2. Install dependencies:
npm install

3. Create `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nestoria_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key
```

4. Start the server:
npm start

Backend will run on `http://localhost:5000`


### Frontend Setup

1. Navigate to frontend directory:
cd frontend

2. Install dependencies:
npm install

3. Create `.env` file:
REACT_APP_API_URL=http://localhost:5000/api

4. Start the development server:
npm start

Frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register/customer` - Register customer
- `POST /api/auth/register/host` - Register host
- `POST /api/auth/login/customer` - Customer login
- `POST /api/auth/login/host` - Host login

### Hotels
- `GET /api/hotels/search` - Search hotels
- `GET /api/hotels/:id` - Get hotel details
- `POST /api/hotels` - Create hotel (Host only)
- `PUT /api/hotels/:id` - Update hotel (Host only)
- `DELETE /api/hotels/:id` - Delete hotel (Host only)

### Rooms
- `GET /api/rooms/:id` - Get room details
- `GET /api/rooms/:id/availability` - Check availability
- `POST /api/rooms` - Create room (Host only)
- `PUT /api/rooms/:id` - Update room (Host only)
- `DELETE /api/rooms/:id` - Delete room (Host only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get customer bookings
- `PUT /api/bookings/:id/cancel` - Cancel booking

### Profile
- `GET /api/customers/profile` - Get customer profile
- `PUT /api/customers/profile` - Update customer profile
- `GET /api/hosts/profile` - Get host profile
- `GET /api/hosts/dashboard/stats` - Get host statistics


## Default Test Accounts

### Customer:
- Email: dummy1@email.com
- Password: (use the one you set during registration)

### Host:
- Email: dummy2@email.com
- Password: (use the one you set during registration)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - feel free to use this project for learning and development.

## Support

For issues and questions:
- Email: support@nestoria.com
- GitHub Issues: [Create an issue](https://github.com/Avaneesh40585/Nestoria/issues)

## Authors

- Your Name - Initial work

## Acknowledgments

- Built as a demonstration of full-stack development with PostgreSQL
- Designed for educational purposes and portfolio projects

