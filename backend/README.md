# Event Management Backend

## Overview

This is the backend service for the Event Management system. It provides RESTful APIs for managing events, bookings, and user authentication.

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher recommended)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository.
2. Navigate to the `event-management-backend` directory.
3. Run `npm install` to install dependencies.
4. Create a `.env` file in the root of this directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the server with:
   ```
   npm start
   ```
6. The server will run on `http://localhost:5000` by default.

## API Documentation

### Authentication

- **POST /auth/register** - Register a new user.
- **POST /auth/login** - Login and receive a JWT token.

### Events

- **GET /events** - Get list of all events.
- **GET /events/:id** - Get details of a specific event.
- **POST /events** - Create a new event (admin only).
- **PUT /events/:id** - Update an event (admin only).
- **DELETE /events/:id** - Delete an event (admin only).

### Bookings

- **POST /bookings/:eventId** - Book an event (authenticated users).
- **GET /bookings/my** - Get bookings of the logged-in user.
- **PUT /bookings/:bookingId/payment-status** - Update payment status of a booking.
- **DELETE /bookings/:bookingId** - Cancel a booking.

## Developer Notes

- Uses Express.js for routing.
- MongoDB with Mongoose for data persistence.
- Authentication via JWT tokens.
- Passwords hashed with bcryptjs.
- CORS enabled for frontend communication.
- Environment variables managed with dotenv.

## Performance Monitoring

- Currently, no integrated monitoring tools.
- It is recommended to add logging middleware and integrate with monitoring services like New Relic, Datadog, or Prometheus.

## Data Privacy Compliance

- User data is stored securely with hashed passwords.
- Ensure GDPR and CCPA compliance by adding user consent mechanisms and data handling policies.
- Consider adding endpoints for data export and deletion upon user request.
