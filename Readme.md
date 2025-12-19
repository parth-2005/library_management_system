# Library Management System

A full-stack MERN (MongoDB, Express, React, Node.js) project for managing a library, featuring robust authentication, book management, assignments, reviews, and email notifications.

---

## Features

- **User & Admin Authentication** (JWT-based, role-based access)
- **Admin Dashboard**: Manage books, users, assignments
- **User Dashboard**: View assigned books, submit reviews, return books
- **Book Management**: CRUD operations for books (admin only), including book cover image upload (Cloudinary integration)
- **User Management**: Admin can create, update, delete users
- **Book Assignment**: Admin assigns books to users, sets due dates and rent
- **Return Books**: Admin can mark books as returned, system updates book quantity
- **Book Reviews**: Users can add/delete reviews(if logged in)
- **Email Reminders**: Admin can send reminder emails to users for book returns (Nodemailer, Gmail SMTP)
- **Responsive, Modern UI**: Built with React, Tailwind CSS, Framer Motion
- **Notifications**: Real-time feedback using react-hot-toast

---

## Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion, React Router, react-hot-toast
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, Multer, Nodemailer

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
cd library_management_system
```

### 2. Backend Setup
```sh
cd backend
npm install
# Create a .env file with:
# JWT_SECRET_KEY=<your-secret>
# MONGO_URI=<your-mongodb-uri>
# CLOUDINARY_CLOUD_NAME=<your_cloud_name>
#CLOUDINARY_API_KEY=<your_API_KEY>
#CLOUDINARY_API_SECRET=<your_API_SECRET>
# SENDER_EMAIL=<your-gmail>
# GOOGLE_PASSWORD=<your-app-password>
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
- **Admin Dashboard:** Manage books, users, assignments, send email reminders
- **User Dashboard:** View assigned books, return books, add reviews

---

## API Endpoints (Summary)

- `/api/admin/signup` — Admin registration
- `/api/admin/login` — Admin login
- `/api/user/login` — User login
- `/api/book/*` — Book CRUD (admin), view (user), reviews
- `/api/admin/users` — User management (admin)
- `/api/assignment/*` — Book assignment/return, send reminder email

---

## Environment Variables

Create a `.env` file in `backend/`:
```
MONGO_URI=mongodb://localhost:27017/library_db
JWT_SECRET_KEY=your_jwt_secret
SENDER_EMAIL=your_gmail_address
GOOGLE_PASSWORD=your_gmail_app_password
```

---

## Notable Implementation Details

- **Book Cover Upload:** Uses Multer middleware and Cloudinary for storing book cover images. Image URL is saved in the database and displayed in the UI.
- **Email Reminders:** Admin can send reminder emails to users for book returns. Uses Nodemailer and Gmail SMTP. Secure, admin-only endpoint.
- **Review System:** Users can add, delete, like, and dislike reviews for books. Only logged-in users can interact with reviews.
- **Assignment Logic:** Assigning a book decrements its quantity; returning a book increments it. Due dates and rent are tracked per assignment.
- **Security:** All sensitive routes require JWT authentication. Admin/user roles enforced via middleware. Email credentials stored in `.env`.

---

- Stars are appreciated✨
