# Library Management Service

A full-stack Library Management System built with React (frontend) and Node.js/Express/MongoDB (backend) featuring JWT-based authentication, role-based access control, and a modern UI.

---

## Features

- **User & Admin Authentication** (JWT-based)
- **Role-based Dashboards**
- **Book Management** (CRUD for admins, view for users)
- **User Management** (admin can create users)
- **Book Assignment** (admin assigns books to users, users see their assignments)
- **Return Books** (admin can mark books as returned)
- **Responsive, Modern UI** (React, Tailwind CSS, Framer Motion)
- **Notifications** (react-hot-toast)

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, React Router, react-hot-toast
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT

---

## Project Structure

```
backend/
  main.js
  controllers/
  middleware/
  modules/
  routers/
  utils/
frontend/
  src/
    pages/
    components/
    services/
```

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- MongoDB (local or Atlas)

### 1. Clone the repository
```sh
git clone <repo-url>
cd library_management_service
```

### 2. Backend Setup
```sh
cd backend
npm install
# Create a .env file with:
# MONGO_URI=<your-mongodb-uri>
# JWT_SECRET_KEY=<your-secret>
node main.js
```

### 3. Frontend Setup
```sh
cd ../frontend
npm install
npm run dev
```

---

## Usage

- Visit `http://localhost:5173` (or the port shown in terminal)
- **Admin Setup:** Go to `/admin/setup` to create the first admin
- **Login:** Use the login page to sign in as user or admin
- **Admin Dashboard:** Manage books, users, assignments
- **User Dashboard:** View assigned books, return books

---

## API Endpoints (Summary)

- `/api/admin/signup` — Admin registration
- `/api/admin/login` — Admin login
- `/api/user/login` — User login
- `/api/book/*` — Book CRUD (admin), view (user)
- `/api/admin/users` — User management (admin)
- `/api/assignment/*` — Book assignment/return

---

## Environment Variables

Create a `.env` file in `backend/`:
```
MONGO_URI=mongodb://localhost:27017/library_db
JWT_SECRET_KEY=your_jwt_secret
```

---

- Stars are appreciated✨
