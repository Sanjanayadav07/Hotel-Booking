# 🏨 QuickStay – Hotel Booking Web App

![Frontend](https://img.shields.io/badge/Frontend-React-blue?logo=react) 
![Backend](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js) 
![Database](https://img.shields.io/badge/Database-MongoDB-darkgreen?logo=mongodb) 
![Deployment](https://img.shields.io/badge/Deployment-Vercel-red) 
![License](https://img.shields.io/badge/License-MIT-lightgrey) 

---

## 📌 Table of Contents
1. [Overview](#overview)
2. [Demo](#demo)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Installation](#installation)
6. [Features](#features)
7. [Screenshots](#screenshots)
8. [Deployment](#deployment)
9. [Future Enhancements](#future-enhancements)
10. [Contributing](#contributing)
11. [License](#license)

---

## 🌟 Overview
**QuickStay** is a **full-stack hotel booking platform** built with the **MERN stack**.  

- 👤 **Users**: Explore hotels, check room availability, make bookings  
- 🧑‍💼 **Hotel Owners**: Manage rooms, bookings, dashboard  
- 🔐 **Secure Authentication**: Role-based access using Clerk Auth  
- ☁️ **Cloud Integration**: Images via Cloudinary  

---

## 🎨 Demo
🌐 **Live Site**: [QuickStay Live](https://quickstay-seven-ebon.vercel.app)  

---

## 🛠️ Tech Stack
| Frontend | Backend | Database | Authentication | Cloud | Deployment |
|----------|---------|----------|----------------|-------|------------|
| React.js ⚛️ | Node.js 🟢 | MongoDB 🍃 | Clerk 🔐 | Cloudinary ☁️ | Vercel / Render 🚀 |

---

## 📂 Project Structure
```text
Hotel-Booking/
├─ client/        # React frontend
│  ├─ src/
│  ├─ public/
│  └─ package.json
├─ server/        # Node/Express backend
│  ├─ controllers/
│  ├─ models/
│  ├─ routes/
│  └─ server.js
├─ .gitignore
└─ README.md
```
## 🚀 Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Sanjanayadav07/Hotel-Booking.git
cd Hotel-Booking
```
### 2️⃣ Install dependencies
```text
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```


### 3️⃣ Setup .env files
```text
server/.env

MONGO_URI=your_mongodb_uri
CLERK_SECRET_KEY=your_clerk_secret
CLOUDINARY_API_KEY=your_cloudinary_key


client/.env

VITE_API_URL=http://localhost:5000
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
```
### 4️⃣ Run the project
```rext
# Backend
cd server
npm run dev

# Frontend
cd client
npm run dev
```
---
##  📌 Features
### 🧑 User Features
- 🔍 Search & view hotels

- Book rooms

- 📅 View booking history

### 🏨 Hotel Owner Features

- ➕ Add new rooms

- ✏️ Edit & delete rooms

- 📊 Dashboard to track bookings

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. **Fork the repository**  
2. **Create a branch**  
```bash
git checkout -b feature/YourFeature
```
3. **Commit your changes**
```bash
git commit -m "Add some feature"
```
4. **Push to the branch**
```bash
git push origin feature/YourFeature
```
5. **Open a Pull Request on GitHub**

## ✍️ Author

**Sanjana Yadav**  

- **GitHub:** [https://github.com/Sanjanayadav07](https://github.com/Sanjanayadav07)  
- **LinkedIn:** [https://www.linkedin.com/in/sanjanayadav07](https://www.linkedin.com/in/sanjanayadav07)  
- **Email:** sanjanayadav3952@gmail.com


