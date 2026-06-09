# 📅 Attendance Management System

A full-stack MERN application for managing employee attendance with live selfie verification, location tracking, role-based access control, and overtime workflow.

---

## 🌐 Live Demo

- **Frontend:** https://attendance-managment-system-dusky.vercel.app
- **Backend API:** https://attendance-managment-system-pnd9.onrender.com

### 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@test.com` | `Admin123` |
| Manager | `manager@test.com` | `Manager123` |
| Employee | `employee@test.com` | `Employee123` |

> ⚠️ Backend hosted on Render free tier - first request may take 30-50 seconds.

---

## ✨ Features

- 🔐 JWT Authentication with Role-Based Access (Employee, Manager, Admin)
- 📸 Punch In/Out with live selfie capture (camera)
- 📍 Real-time location tracking
- ⏰ Automatic working hours calculation (8-hour standard shift)
- 📝 Overtime request & approval workflow
- ✅ Attendance validation by Manager/Admin
- 📊 Role-specific dashboards
- 📋 Daily & summary reports with filters
- 🎨 Dark mode support
- 📱 Fully responsive design

---

## 🛠️ Tech Stack

**Frontend:** React, Vite, Redux Toolkit, React Router, Tailwind CSS, Axios

**Backend:** Node.js, Express, MongoDB Atlas, JWT, Bcrypt, Multer, Cloudinary

**Logging:** Winston + Morgan

**Deployment:** Vercel (Frontend) + Render (Backend)

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

---

### 🔧 Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file

# Fill in your credentials in .env file

# Start development server
npm run dev
```

✅ Backend runs on `http://localhost:5000`

---

### 🎨 Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file 

# Fill in your credentials in .env file

# Start development server
npm run dev
```

✅ Frontend runs on `http://localhost:5173`

---

## 🔑 Environment Variables

### Backend `.env`

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=Attendance Management System
```

---

## 🏗️ Architecture

- **RESTful API** with Express.js
- **MVC Pattern** (Models, Controllers, Routes)
- **Middleware-based** authentication & authorization
- **Redux Toolkit** for state management
- **Cloudinary** for image storage
- **MongoDB Atlas** for cloud database

---

## 📝 Assumptions

1. One attendance record per user per day
2. Standard shift = 8 hours
3. Overtime range: 0.5 to 6 hours
4. Camera & location required (HTTPS/localhost only)
5. Employees assigned to one manager
6. Soft delete for users (deactivation)
7. Selfies stored on Cloudinary
8. Employee IDs auto-generated (EMP0001, etc.)

---

## 👨‍💻 Developer

**Atharva Atre** - [@Atharv255](https://github.com/Atharv255)
