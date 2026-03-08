# HouseHunt

A Node.js REST API for a house rental and real estate platform. Supports three user roles — **admin**, **owner**, and **user** — each with dedicated routes and controllers.

---

## Project Structure

```
house_hunt/
├── server.js
├── package.json
├── .env.example
├── uploads/
└── backend/
    ├── config/
    │   └── connect.js
    ├── models/
    │   ├── UserSchema.js
    │   ├── PropertySchema.js
    │   └── BookingSchema.js
    ├── middlewares/
    │   └── authMiddleware.js
    ├── controllers/
    │   ├── userController.js
    │   ├── ownerController.js
    │   └── adminController.js
    └── routes/
        ├── userRoutes.js
        ├── ownerRoutes.js
        └── adminRoutes.js
```

---

## Tech Stack

- **Runtime** – Node.js
- **Framework** – Express.js
- **Database** – MongoDB (Mongoose ODM)
- **Authentication** – JSON Web Tokens (JWT)
- **Password Hashing** – bcryptjs
- **File Uploads** – Multer
- **Environment Variables** – dotenv
- **CORS** – cors

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
# Clone the repo
git clone <repo-url>
cd house_hunt

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
PORT=8000
MONGO_URI=mongodb://localhost:27017/househunt
JWT_SECRET=your_jwt_secret_key_here
```

### Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:8000` by default.

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | Port the server listens on (default: 8000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key used to sign JWT tokens |

---

## Database Schemas

### User

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | Yes | First letter auto-capitalised |
| email | String | Yes | Unique, stored lowercase |
| password | String | Yes | Stored as bcrypt hash |
| type | String | Yes | `admin` / `owner` / `user` |

### Property

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| ownerId | ObjectId | — | Ref: `user` |
| propertyType | String | Yes | e.g. Apartment, Villa |
| propertyAdType | String | Yes | `rent` or `sale` |
| propertyAddress | String | Yes | |
| ownerContact | String | Yes | |
| propertyAmt | Number | — | Default: 0 |
| propertyImage | Object | — | Stored file metadata |
| additionalInfo | String | — | |
| ownerName | String | — | Auto-filled from owner record |

### Booking

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| propertId | ObjectId | — | Ref: `propertyschema` |
| ownerID | ObjectId | — | Ref: `user` |
| userID | ObjectId | — | Ref: `user` |
| userName | String | Yes | |
| phone | String | Yes | |
| bookingStatus | String | Yes | `pending` / `confirmed` / `rejected` / `completed` |

---

## API Reference

All protected routes require the header:

```
Authorization: Bearer <token>
```

---

### User Routes — `/api/user`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/signup` | No | Register a new account |
| POST | `/login` | No | Login and receive JWT |
| GET | `/properties` | No | Browse all property listings |
| GET | `/properties/:id` | No | Get a single property by ID |
| POST | `/booking` | Yes | Create a booking |
| GET | `/mybookings` | Yes | Get logged-in user's bookings |
| DELETE | `/booking/:id` | Yes | Cancel a pending booking |

#### POST `/api/user/signup`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123",
  "type": "user"
}
```

#### POST `/api/user/login`

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:**

```json
{
  "token": "<jwt>",
  "user": { "id": "...", "name": "John Doe", "email": "...", "type": "user" }
}
```

#### GET `/api/user/properties` — Query Filters

| Param | Type | Example |
|-------|------|---------|
| `propertyType` | String | `Apartment` |
| `propertyAdType` | String | `rent` |
| `minAmt` | Number | `5000` |
| `maxAmt` | Number | `20000` |

#### POST `/api/user/booking`

```json
{
  "propertId": "<property_id>",
  "ownerID": "<owner_id>",
  "userName": "John Doe",
  "phone": "9876543210"
}
```

---

### Owner Routes — `/api/owner`

All routes require a valid JWT with `type: "owner"`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/property` | Add a new property listing |
| PUT | `/property/:id` | Update an existing property |
| DELETE | `/property/:id` | Delete a property |
| GET | `/properties` | Get all of the owner's properties |
| GET | `/bookings` | Get all bookings for the owner's properties |
| PUT | `/booking/:id` | Update booking status |

#### POST/PUT `/api/owner/property`

Sent as `multipart/form-data`:

| Field | Type | Required |
|-------|------|----------|
| propertyType | String | Yes |
| propertyAdType | String | Yes |
| propertyAddress | String | Yes |
| ownerContact | String | Yes |
| propertyAmt | Number | No |
| additionalInfo | String | No |
| propertyImage | File | No (jpg/jpeg/png/webp, max 5MB) |

#### PUT `/api/owner/booking/:id`

```json
{
  "bookingStatus": "confirmed"
}
```

Valid values: `pending`, `confirmed`, `rejected`, `completed`

---

### Admin Routes — `/api/admin`

All routes require a valid JWT with `type: "admin"`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Platform statistics |
| GET | `/users` | List all users |
| DELETE | `/user/:id` | Delete a user (cascades to their properties and bookings) |
| GET | `/properties` | List all properties |
| DELETE | `/property/:id` | Delete a property (cascades to its bookings) |
| GET | `/bookings` | List all bookings |

#### GET `/api/admin/dashboard` — Response

```json
{
  "totalUsers": 120,
  "totalOwners": 30,
  "totalProperties": 85,
  "totalBookings": 200,
  "bookingsByStatus": [
    { "_id": "pending", "count": 50 },
    { "_id": "confirmed", "count": 100 },
    { "_id": "completed", "count": 40 },
    { "_id": "rejected", "count": 10 }
  ]
}
```

---

## File Uploads

Property images are stored in the `uploads/` directory and served statically at:

```
GET /uploads/<filename>
```

- Accepted formats: `jpg`, `jpeg`, `png`, `webp`
- Max file size: **5 MB**
- Field name: `propertyImage`

---

## Authentication Flow

1. User registers via `POST /api/user/signup`
2. User logs in via `POST /api/user/login` and receives a JWT
3. JWT is included in the `Authorization` header for protected requests
4. `authMiddleware.js` verifies the token and attaches `req.user` (id, type, name)
5. Role guards (`isAdmin`, `isOwner`) restrict access to role-specific routes

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start server with Node |
| `npm run dev` | Start server with Nodemon (auto-reload) |
