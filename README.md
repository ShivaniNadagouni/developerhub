# DeveloperHub Backend

The backend of **DeveloperHub** is a RESTful API built using **Node.js**, **Express.js**, and **MongoDB**. It provides secure authentication, user management, and API endpoints for the frontend application.

## 🚀 Features

- User Registration
- User Login
- JWT Authentication
- Password Encryption using bcrypt
- MongoDB Database Integration
- RESTful API Architecture
- Environment Variable Configuration
- CORS Enabled
- Error Handling

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JSON Web Token (JWT)
- cors
- nodemon

---

## 📁 Project Structure

```
backend/
│
├── config/
│   └── db.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── authRoutes.js
│
├── middleware/
│   └── authMiddleware.js
│
├── server.js
├── package.json
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/developerhub.git
```

Navigate to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

---

## ▶️ Run the Server

Development Mode

```bash
npm run dev
```

Production Mode

```bash
npm start
```

The server will run on

```
http://localhost:5000
```

---

## 📌 API Endpoints

### Register User

```
POST /register
```

Request Body

```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "skill": "MERN",
  "password": "password123",
  "confirmpassword": "password123"
}
```

---

### Login User

```
POST /login
```

Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response

```json
{
  "token": "JWT_TOKEN"
}
```

---

## 🔒 Authentication

Protected routes require a JWT token.

Example Header

```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 🗄 Database

This project uses **MongoDB Atlas** as the cloud database.

Mongoose is used as the ODM to interact with MongoDB collections.

---

## 📦 Main Dependencies

- express
- mongoose
- bcryptjs
- jsonwebtoken
- dotenv
- cors
- nodemon

---

## 🧪 Testing APIs

You can test the APIs using:

- Postman
