# 🚌 VIT Shuttle System

> A modern, production-ready campus shuttle management platform built for VIT students.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | JWT-based login/signup with role-based access |
| 🎟️ QR Pass System | Buy daily/monthly/yearly passes with QR codes |
| 💳 Razorpay Payments | Real payment integration (test mode ready) |
| ⏱️ Live Timetable | Real-time shuttle schedule with next-bus countdown |
| 📷 QR Scanner | Camera-based attendance marking |
| 📢 Complaints | Submit, track, and resolve complaints with images |
| 🛠️ Admin Console | Full management dashboard with charts |
| 🌗 Dark/Light Mode | System-wide theme with localStorage persistence |
| 📱 Responsive | Mobile-first design |

---

## 🚀 Quick Start

### 1. Start the Backend

```bash
cd backend
node server.js
```
> Server runs at **http://localhost:5001**  
> ⚠️ Port 5000 is blocked by macOS Control Center

### 2. Open Frontend

Open any `.html` file via **VS Code Live Server** (port 5500) or directly in your browser:

| Page | File |
|------|------|
| 🏠 Landing Page | `index.html` |
| 🔐 Sign In / Sign Up | `signin.html` |
| 🎓 Student Dashboard | `student-portal.html` |
| 🛠️ Admin Dashboard | `admin-portal.html` |


## 💳 Test Payment

Use Razorpay test card:
```
Card:   4111 1111 1111 1111
CVV:    123
Expiry: Any future date
```

---

## 📁 Project Structure

```
VIT Shuttle/
├── index.html              — Landing page
├── signin.html             — Auth (login / signup)
├── student-portal.html     — Student dashboard (8 tabs)
├── admin-portal.html       — Admin console
├── style.css               — Global design system (light/dark)
├── shared.js               — API client, Auth, Toast utilities
├── pages/
│   ├── portal.css          — Portal component styles
│   ├── portal.js           — Student portal logic
│   └── admin.js            — Admin portal logic
└── backend/
    ├── server.js           — Express server (port 5001)
    ├── seed.js             — Database seeder
    ├── .env                — Environment variables (git-ignored)
    ├── models/             — Mongoose models
    │   ├── User.js
    │   ├── Pass.js
    │   ├── Payment.js
    │   ├── Complaint.js
    │   ├── Shuttle.js
    │   └── ScanLog.js
    ├── routes/             — Express route handlers
    │   ├── auth.js, passes.js, payments.js
    │   ├── complaints.js, shuttles.js
    │   ├── scans.js, users.js, admin.js
    └── middleware/
        ├── auth.js         — JWT guard
        └── upload.js       — Multer upload
```

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3 (Glassmorphism), Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JWT (jsonwebtoken) + bcrypt
- **Payments:** Razorpay
- **Email:** Nodemailer (upcoming)

---

## 🗄️ Re-seed Database

```bash
cd backend
npm run seed
```

---

## 📌 API Base URL

```
http://localhost:5001/api
```

**Health check:**
```bash
curl http://localhost:5001/api/health
```

---

## 👨‍💻 Author

Built by **Alok Maan** — VIT Student, 2nd Year B.Tech CSE
