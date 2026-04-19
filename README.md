# 🌾 EasFarm (FarmBazaar)

> A modern agriculture ecosystem platform connecting farmers, buyers, and governance tools in one place.

---

## 🚀 About the Project

**EasFarm**, also referred to as **FarmBazaar**, is a full-stack digital platform designed to empower farmers, streamline agricultural services, and enable transparent interaction between users, admins, and government schemes.

The platform brings together:

* Agricultural marketplace features
* Government schemes & information access
* User-generated content and reporting system
* Role-based admin management system

Built with scalability and real-world agricultural workflows in mind.

---

## 🌟 Key Features

### 👨‍🌾 For Farmers & Users

* Browse and explore agricultural content
* Access government schemes (GovernmentSchemes module)
* Submit reports and feedback
* Engage with platform content

### 🛒 Marketplace (FarmBazaar Core)

* Agricultural product listings
* Buyer-seller interaction system
* Product discovery interface

### 🛡️ Admin System

* Role-based access control (User / Admin / Super Admin)
* Admin management panel
* Content moderation tools
* Report handling system

### 🏛️ Government Schemes Module

* Public access listing of schemes
* Easy filtering and browsing
* Informational transparency for farmers

---

## 🧱 Tech Stack

### Frontend

* React.js
* Tailwind CSS / DaisyUI
* Axios

### Backend

* Node.js
* Express.js
* MongoDB

### Authentication & Security

* JWT-based authentication
* Role-based middleware

---

## 📁 Project Structure

```
EasFarm/
│
├── client/                # Frontend (React)
├── server/                # Backend (Node + Express)
├── models/                # Database schemas
├── routes/                # API routes
├── controllers/           # Business logic
├── middleware/            # Auth & role checks
├── utils/                 # Helper functions
└── README.md
```

---

## 🔐 Roles System

* **User** → Normal platform user
* **Admin** → Manages content and moderation
* **Super Admin** → Full system control (role assignment, admin control)

---

## ⚙️ Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/UjjwalDikshit/EasFarm.git
cd EasFarm
```

### 2. Install Dependencies

#### Backend

```bash
cd server
npm install
```

#### Frontend

```bash
cd client
npm install
```

### 3. Environment Variables

Create `.env` in server folder:

```
MONGODB_URI = ...
PORT = 4000
REDIS_PASS = ...
JWT_SECRET = ...
GMAILPASS = ...
GEMINI_API_KEY = ...

WEATHER_BASE_URL= http://api.weatherapi.com/v1
WEATHER_API_KEY= ...

RAZORPAY_KEY_ID=....
RAZORPAY_KEY_SECRET=...

TOKEN_TIME = 86400000
# 24 hoour

CLOUDINARY_SECRET_API_KEY = ...
CLOUDINARY_API_KEY = ...
CLOUDINARY_NAME = ....
NODE_ENV = production
```

### 4. Run Project

#### Backend

```bash
node index.js
```

#### Frontend

```bash
npm run dev
```

---

## 📡 API Overview

* `/auth` → Authentication routes
* `/users` → User management
* `/admin` → Admin panel APIs
* `/schemes` → Government schemes
* `/reports` → Reporting system

---

## 📌 Future Improvements

* AI-based crop recommendations
* Real-time marketplace chat
* Mobile app (React Native)
* Payment gateway integration
* Multi-language support

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a pull request

---

## 👨‍💻 Author

Built with dedication for agricultural empowerment.

**Project Name:** EasFarm (FarmBazaar)
By: Ujjwal Dikshit
