# Email Integration Setup Guide

This guide explains how to set up email functionality for sending reminder emails to users about their book return deadlines.

## Backend Email Configuration

### 1. Install Nodemailer

The `nodemailer` package is already added to `package.json`. Install it by running:

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Add the following environment variables to your `backend/.env` file:

```env
# Email Configuration
EMAIL_SERVICE=gmail                    # Email service provider (gmail, outlook, etc.)
EMAIL_USER=your-email@gmail.com        # Your email address
EMAIL_PASSWORD=your-app-password       # Your App Password
```

### 3. Gmail Setup (Recommended)

If you're using Gmail, you'll need to create an **App Password** instead of using your regular password:

```

#### Custom SMTP Server
If you want to use a custom SMTP server, modify `backend/utils/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: 'smtp.yourdomain.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### 5. Test Email Configuration

You can test your email configuration by creating a test endpoint or using the `testEmailConnection` function in `emailService.js`.

## API Endpoints

### Send Reminder Email for Single Assignment

**POST** `/api/assignment/send-reminder/:assignmentId`

- **Auth Required:** Yes (Admin only)
- **Description:** Sends a reminder email to the user associated with a specific assignment
- **Response:**
  ```json
  {
    "message": "Reminder email sent successfully",
    "assignment": {
      "id": "...",
      "user": "username",
      "email": "user@example.com",
      "book": "Book Title",
      "daysRemaining": 5
    }
  }
  ```

  ```

## Frontend Usage

### Admin Assignments Page

Navigate to `/admin/assignments` from the admin dashboard to:
- View all assignments
- Filter by status (All, Active, Returned)
- Send reminder emails to individual users
- Mark books as returned

### Sending Emails

1. Click the **"📧 Send Reminder"** button next to any active assignment
2. The system will automatically:
   - Calculate days remaining until due date
   - Format a personalized email
   - Send it to the user's email address
   - Show a success/error notification

## Email Template Features

The email template includes:
- **Personalized greeting** with user's name
- **Book details** (title, due date, days remaining)
- **Visual indicators** for overdue/approaching deadlines
- **Professional HTML formatting** with responsive design
- **Plain text fallback** for email clients that don't support HTML


