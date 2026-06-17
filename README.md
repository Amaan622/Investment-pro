# 🚀 MERN Stack Investment & Referral Platform

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application built as part of the Nexachain AI Technical Assessment.

The platform simulates an investment ecosystem with ROI generation, referral income distribution, wallet management, and dashboard analytics.

---

## 🌐 Live Demo

* Frontend: https://investment-pro-ecru.vercel.app
* Backend: https://investment-pro-fx4y.onrender.com

---

## 📌 Project Overview

This application allows users to:

* Register and login securely using JWT authentication
* Invest in different investment plans
* Earn daily ROI (Return on Investment)
* Receive multi-level referral income
* Track wallet balance and earnings
* Monitor ROI history and referral rewards
* Access a responsive analytics dashboard

---

## ✨ Features

### Authentication

* User Registration
* User Login
* JWT Authentication
* Password Hashing using Bcrypt
* Protected Routes

### Investment System

* Create New Investments
* View Active Investments
* Track Investment Status
* Automatic ROI Generation

### Referral System

* Unique Referral Code Generation
* Direct Referral Tracking
* Multi-Level Referral Income Distribution
* Referral Tree Visualization

### Wallet Management

* Wallet Balance Tracking
* ROI Earnings Tracking
* Referral Income Tracking
* Investment Statistics

### Dashboard Analytics

* Total Investments
* Active Investments
* Wallet Balance Overview
* ROI Earnings Summary
* Referral Income Summary
* Referral Network Statistics

---

## ⚙️ Tech Stack

### Frontend

* React.js
* React Router DOM
* Axios
* CSS / Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Bcrypt.js
* Express Validator
* Node-Cron

### Security

* Helmet
* Express Rate Limiter
* JWT Protected Routes
* Role-Based Access Control

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## 🗂️ Database Models

### User

* Name
* Email
* Password (Encrypted)
* Referral Code
* Referred By
* Wallet Balance
* Total Invested
* Total ROI Earned
* Total Level Income
* Account Status

### Investment

* User Reference
* Investment Amount
* Plan Information
* Daily ROI Percentage
* Start Date
* End Date
* Status

### ROI History

* User Reference
* Investment Reference
* ROI Amount
* ROI Type
* Date

### Referral



* Referral Level
* Income Amount
* Date

---

## 🔐 Authentication & Security

The application uses JWT-based authentication with secure password hashing.

### Security Features

* Password Hashing with Bcrypt
* JWT Access Tokens
* Protected API Routes
* Express Rate Limiting
* Helmet Security Headers
* Role-Based Authorization
* Request Validation using Express Validator

---

## 📡 API Features

* User Authentication
* Investment Management
* Dashboard Analytics
* ROI History Tracking
* Referral Tree Management
* Wallet Tracking
* Admin ROI Processing

---

## ⏰ Automated ROI System

A scheduled cron job runs daily to:

* Calculate ROI for active investments
* Credit earnings to user wallets
* Store ROI history records
* Update user statistics
* Prevent duplicate ROI credits using idempotency protection

---
Project Sturcture
project-root
│
├── backend
│   ├── jobs
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── package.json
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   │   ├── Dashboard
│   │   │   ├── Investments
│   │   │   ├── Referral
│   │   │   └── ROI
│   │   ├── hooks
│   │   └── services
│   ├── package.json
│   └── vite.config.js
│
└── README.md

## 📦 Installation & Setup

### Clone Repository

```bash
git clone https://github.com/Amaan622/YOUR_REPOSITORY.git
```

### Navigate to Project

```bash
https://github.com/Amaan622/Investment-pro
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http:investment-pro-ecru.vercel.app
```

### Frontend (.env)

```env
VITE_API_URL=VITE_API_URL=https://investment-pro-fx4y.onrender.com
```

---

## 🚀 Deployment

### Frontend

* Vercel

### Backend

* Render

### Database

* MongoDB Atlas

---

## 🧪 Future Enhancements

* Withdrawal System
* Admin Dashboard
* KYC Verification
* Email Verification
* Push Notifications
* Payment Gateway Integration
* Advanced Analytics
* Multi-Currency Support

---

## 👨‍💻 Author

**Amaan**

MERN Stack Developer

Built for the Nexachain AI Technical Assessment.

---

## 📄 License

This project is intended for educational and assessment purposes.
