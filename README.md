# CivicEase

A civic service management platform that enables citizens to request services and administrators to manage service requests efficiently.

## Features

- Role-based access control (Admin, Staff, Citizen)
- Service request management
- Real-time status updates
- Staff assignment system
- Administrative dashboard
- Secure authentication

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/CivicEase.git
cd CivicEase
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../client
npm install
```

3. Set up environment variables:
```bash
# In the backend directory
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development servers:
```bash
# Start backend server (from backend directory)
npm run dev

# Start frontend server (from client directory)
npm start
```

## Deployment

### Backend Deployment

1. Set up environment variables:
   - `NODE_ENV`: Set to 'production'
   - `MONGO_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string
   - `PORT`: The port to run on (default: 5001)
   - `ALLOWED_ORIGINS`: Comma-separated list of allowed frontend origins

2. Build and start:
```bash
cd backend
npm install --production
npm start
```

### Frontend Deployment

1. Set up environment variables:
```bash
# Create .env.production
REACT_APP_API_URL=https://your-api-domain.com/api
```

2. Build and deploy:
```bash
cd client
npm run build
```

3. Deploy the contents of the `build` directory to your web server

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- XSS protection
- NoSQL injection protection
- CORS configuration
- HTTP security headers

## API Documentation

### Authentication Endpoints

- POST `/api/auth/signup`: Create a new user account
- POST `/api/auth/login`: Log in to existing account

### Service Endpoints

- GET `/api/services`: Get all services
- POST `/api/services`: Create a new service (Admin only)
- PUT `/api/services/:id`: Update a service (Admin only)
- DELETE `/api/services/:id`: Delete a service (Admin only)

### Service Request Endpoints

- GET `/api/service-requests`: Get user's service requests
- POST `/api/service-requests`: Create a new service request
- PATCH `/api/service-requests/:id`: Update request status

### Admin Endpoints

- GET `/api/admin/stats`: Get system statistics
- GET `/api/admin/users/staff`: Get all staff members
- PATCH `/api/admin/service-requests/:id/assign`: Assign staff to request
- PATCH `/api/admin/service-requests/:id/status`: Update request status

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
