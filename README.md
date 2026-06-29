# 📱 Mini Social Media App

A full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** based social media application where users can create accounts, upload image posts with captions, interact through likes and comments, follow other users, and view personalized feeds.

---

# 🚀 Features

### 👤 Authentication

* User Registration
* User Login
* Secure JWT Authentication
* Password Hashing using bcrypt
* Cookie-based Authentication
* Protected Routes

### 👤 User Profile

* View own profile
* View other users' profiles
* Edit Bio
* Follow / Unfollow Users
* Followers & Following Count
* Followers & Following List

### 📷 Posts

* Upload image posts
* Add captions
* View personal posts
* Delete own posts

### ❤️ Likes

* Like posts
* Unlike posts
* Like count
* Detect whether current user already liked a post

### 💬 Comments

* Add comments
* View comments
* Comment count
* Navigate to commenter profile

### 📰 Feed

* View all users' posts
* View following users' posts
* Dynamic feed switching
* Latest posts first

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Fetch API
* CSS

## Backend

* Node.js
* Express.js

## Database

* MongoDB
* Mongoose

## Authentication

* JWT
* bcrypt

## File Upload

* Multer

---

# 📂 Project Structure

```
Mini-Social-Media-App/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

---

# 📦 Installation

## 1. Clone Repository

```bash
git clone https://github.com/yourusername/mini-social-media-app.git
```

```bash
cd mini-social-media-app
```

---

# 📥 Backend Setup

Navigate to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

Run backend

```bash
npm run dev
```

Server runs on

```
http://localhost:5000
```

---

# 💻 Frontend Setup

Open another terminal

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run React application

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 📁 Image Upload

Images are uploaded using **Multer**.

Uploaded images are stored inside

```
backend/uploads/
```

Only the image path is stored inside MongoDB.

Example:

```
uploads/1749203858.jpg
```

---

# 🗄️ Database Models

## User

* Name
* Email
* Password
* Bio

---

## Post

* Caption (Content)
* Image
* User
* Created At

---

## Comment

* Text
* User
* Post

---

## Like

* User
* Post

---

## Follow

* Follower
* Following

---

# 🔗 API Overview

## Authentication

```
POST /api/auth/register
POST /api/auth/login
```

---

## Users

```
GET    /api/users/me
GET    /api/users/:id
PUT    /api/users/me/bio

POST   /api/users/:id/follow
GET    /api/users/:id/follow-status
GET    /api/users/:id/follow-count
GET    /api/users/:id/followers
GET    /api/users/:id/following
```

---

## Posts

```
GET    /api/posts/feed
GET    /api/posts/feed/following

POST   /api/posts

DELETE /api/posts/:id

GET    /api/posts/user/me
GET    /api/posts/user/:id
```

---

## Likes

```
POST /api/posts/:id/like
```

---

## Comments

```
GET  /api/posts/:postId/comments

POST /api/posts/:postId/comments
```

---

# 🔄 Application Flow

```
Register/Login
        │
        ▼
JWT Cookie Created
        │
        ▼
User Authentication
        │
        ▼
Feed
        │
        ├───────────────┐
        │               │
        ▼               ▼
 Profile           View Posts
        │               │
        ▼               ▼
Create Post      Like / Comment
        │               │
        └──────┬────────┘
               ▼
      Follow / Unfollow Users
```

---

# 🔒 Security

* JWT Authentication
* Password hashing using bcrypt
* Protected APIs
* Cookie-based authentication
* Authorization for deleting posts
* Users can edit only their own profile
* Users can delete only their own posts

---

# 🎯 Future Improvements

* Real-time notifications
* Stories feature
* Direct messaging
* Image editing
* Cloudinary integration
* Dark mode
* Infinite scrolling
* Search users
* Hashtags
* Reels / Videos

---

# 📸 Screenshots

Add screenshots here after completing the UI.

Example:

```
Home Feed

Profile

Create Post

Followers

Comments
```

---

# 👨‍💻 Author

**Deep Baldha**

GitHub: https://github.com/DB1132

LinkedIn: https://www.linkedin.com/in/dip-baldha-492596288/

---

# ⭐ If you like this project

Give this repository a ⭐ on GitHub if you found it useful.
