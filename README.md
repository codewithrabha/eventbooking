# Event Booking System API Documentation

## Overview
This is a RESTful API for an event booking system built with Node.js, Express, and Supabase. The API enables users to manage events, make bookings, and handle user profiles.

## Authentication
The API uses Supabase Authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Base URL
```
http://localhost:3000/api
```

## API Endpoints

### Events

#### Get All Events
```http
GET /events
```
- Returns a list of all events
- Public access
- Response: Array of event objects

#### Get Single Event
```http
GET /events/:id
```
- Returns details of a specific event
- Public access
- Response: Single event object

#### Create Event
```http
POST /events
```
- Creates a new event
- Requires authentication
- Request body:
  ```json
  {
    "title": "string",
    "description": "string",
    "date": "ISO8601 date",
    "capacity": "number",
    "price": "number"
  }
  ```

#### Update Event
```http
PUT /events/:id
```
- Updates an existing event
- Requires authentication
- Only event creator can update
- Request body: Same as create event (all fields optional)

#### Delete Event
```http
DELETE /events/:id
```
- Deletes an event
- Requires authentication
- Only event creator can delete

### Bookings

#### Get User's Bookings
```http
GET /bookings
```
- Returns all bookings for authenticated user
- Requires authentication
- Response: Array of booking objects with event details

#### Create Booking
```http
POST /bookings
```
- Creates a new booking
- Requires authentication
- Request body:
  ```json
  {
    "event_id": "uuid",
    "quantity": "number"
  }
  ```

#### Cancel Booking
```http
PUT /bookings/:id/cancel
```
- Cancels an existing booking
- Requires authentication
- Only booking owner can cancel

### User Profiles

#### Get User Profile
```http
GET /profiles/me
```
- Returns authenticated user's profile
- Requires authentication

#### Update Profile
```http
PUT /profiles/me
```
- Updates user profile
- Requires authentication
- Request body:
  ```json
  {
    "full_name": "string",
    "phone": "string"
  }
  ```

## Data Models

### Event
```typescript
{
  id: uuid
  title: string
  description: string
  date: timestamp
  capacity: number
  price: number
  created_at: timestamp
  created_by: uuid
}
```

### Booking
```typescript
{
  id: uuid
  event_id: uuid
  user_id: uuid
  quantity: number
  total_price: number
  status: 'confirmed' | 'cancelled'
  created_at: timestamp
}
```

### Profile
```typescript
{
  id: uuid
  full_name: string
  phone: string
  updated_at: timestamp
}
```

## Error Handling
The API returns standard HTTP status codes:
- 200: Success
- 201: Created
- 204: No Content
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses include a JSON object with an error message:
```json
{
  "error": "Error message description"
}
```

## Rate Limiting
No rate limiting is currently implemented.

## Testing
Tests are written using Mocha and Chai. Run tests with:
```bash
npm run test
```

## Environment Variables
Required environment variables:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000 (optional, defaults to 3000)
```

## Security
- Row Level Security (RLS) is enabled on all tables
- Authentication is required for all write operations
- Users can only modify their own data
- Event creators can only modify their own events
- Booking creators can only modify their own bookings