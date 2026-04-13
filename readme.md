# Employee Management System

A comprehensive Full-Stack Employee Management System built using React, Node.js, Express, TypeScript, and MongoDB. This system allows for managing employees, tracking attendance, handling leave requests, salary processing, and internal communication.

## 🚀 Features

- **Authentication & Security**: Secure login for both Administrators and Employees using JWT and Bcrypt hashing.
- **Employee Management**: Full CRUD operations for managing employee profiles, including personal details and profile pictures.
- **Attendance Tracking**: Clock-in/out functionality with history tracking.
- **Leave & Holiday Management**: Submit, review, and manage leave requests, and keep track of public holidays.
- **Salary Management**: Process and track monthly salaries and payments.
- **Communication System**: Internal mailing/notification system using Nodemailer.
- **Profile Image Uploads**: Integrated with Cloudinary for secure and scalable image storage.
- **Responsive Dashboard**: A modern, interactive UI built with React and Vite.

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern UI library
- **React Router DOM** - Navigation and routing
- **Vite** - High-performance build tool
- **EmailJS** - Client-side email integration

### Backend
- **Node.js & Express** - Server-side environment and framework
- **TypeScript** - For type safety and better developer experience
- **MongoDB & Mongoose** - NoSQL database for flexible data modeling
- **JWT (JSON Web Tokens)** - Secure authentication
- **Multer & Cloudinary** - File upload and cloud storage
- **Nodemailer** - Server-side email notifications
- **Node-cron** - Scheduled tasks/jobs

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or a local MongoDB instance)
- [Cloudinary](https://cloudinary.com/) account (for image uploads)

## 🔧 Installation & Setup

### 1. Clone the repository
```bash
git clone <repository-url>
cd employee-management-system
```

### 2. Backend Configuration
Navigate to the `backend` directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add your credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### 3. Frontend Configuration
Navigate to the `frontend` directory and install dependencies:
```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🏃 Running the Application

### Start Backend
From the `backend` directory:
```bash
npm run dev
```
The server will start on `http://localhost:5000`.

### Start Frontend
From the `frontend` directory:
```bash
npm run dev
```
The application will be accessible at `http://localhost:5173`.

## 📂 Project Structure

```
├── backend/            # Express server with TypeScript
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Auth and error middlewares
│   ├── model/          # Mongoose schemas
│   ├── routes/         # API endpoints
│   ├── service/        # Business logic
│   └── server.ts       # Entry point
├── frontend/           # React frontend
│   ├── public/         # Static assets
│   └── src/            # Components, pages, and logic
└── uploads/            # Local temporary storage (if applicable)
```

## 📄 License
This project is [ISC](https://opensource.org/licenses/ISC) licensed.
