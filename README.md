YouTube Clone — MERN Stack (Full Project)

A full-stack YouTube Clone built using the MERN (MongoDB, Express, React, Node.js) stack with JWT Authentication, Video Player, Channel Management, Shorts, and Comment System — fully functional and responsive.

Overview

This project replicates the core experience of YouTube — users can:

Watch and upload videos

Create and customize their channels

Like, dislike, and comment

View Shorts

Search and filter videos by category

Switch between light and dark mode

It demonstrates complete CRUD operations, authentication, API design, and responsive UI development.

Tech Stack
Frontend

React (Vite)

React Router DOM

Tailwind CSS

Framer Motion (Animations)

Axios

React Hot Toast

JWT (Token-based Auth)

Backend

Node.js + Express.js

MongoDB + Mongoose

JSON Web Token (JWT)

Bcrypt (Password hashing)

CORS Middleware

Features
Home Page

Displays:

Responsive YouTube-style header and sidebar

Category filter buttons

Video grid (3 per row)

Shorts section (with horizontal scroll)

“View All” button for Shorts

User Authentication

Users can:

Register & Login (with validation)

Secure JWT-based session

Stay logged in after refresh

Logout anytime
Stored in localStorage

Search & Filter

Implemented:

Search by video title

Category-based filter

Filter dynamically updates videos from backend

Video Player Page

Includes:

Video player with title & description

Like / Dislike buttons

Comment section with:

Add, edit, delete, like, dislike comments

Subscribe button for channel

Related (suggested) videos sidebar

Channel Page

Channel owners can:

View all their uploaded videos

Manage channel info

Navigate via tabs (Home, Videos, Shorts, About)

CRUD functionality on their videos

Studio Page (Channel Customization)

Channel owners can:

Update banner, avatar, name, description

See live preview

Publish updates instantly

Shorts Page

Full-screen vertical videos (snap-scroll)

Play automatically with sound

Like, comment, and share options (functional)

Additional Functionalities

Responsive Layout (Mobile, Tablet, Desktop)

Dark/Light Theme Toggle

Protected Routes

Error Handling and Toast Notifications

Video Upload System

Dynamic Channel and Profile Pages

Project Structure
youtube-clone/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── videoController.js
│   │   ├── channelController.js
│   │   ├── commentController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.model.js
│   │   ├── Video.model.js
│   │   ├── Channel.model.js
│   │   └── Comment.model.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── videoRoutes.js
│   │   ├── channelRoutes.js
│   │   ├── commentRoutes.js
│   │   ├── likeRoutes.js
│   │   └── userRoutes.js
│   ├── Seeder.js
│   ├── DummyVideos.js
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── VideoCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── VideoDetails.jsx
│   │   │   ├── Channel.jsx
│   │   │   ├── ChannelPage.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Upload.jsx
│   │   │   ├── Shorts.jsx
│   │   │   ├── Studio.jsx
│   │   │   ├── Search.jsx
│   │   │   └── Subscriptions.jsx
│   │   ├── context/
│   │   └── utils/
│   ├── tailwind.config.js
│   ├── package.json
│   └── index.html
│
├── .gitignore
├── package.json
└── README.md

Setup Instructions

Clone the Repository

git clone https://github.com/Ishfaqmir1/youtube-clone
cd youtube-clone


Install Dependencies

Install both backend & frontend:

cd backend && npm install
cd ../frontend && npm install


Create .env File

Inside /backend, create .env:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key


Run the Application

Open two terminals:

Terminal 1 (Backend):

cd backend
npm run dev


Terminal 2 (Frontend):

cd frontend
npm run dev


Now visit:
http://localhost:5173



Author

Ishfaq Ahmad Mir
MERN Stack Developer | React.js Enthusiast | MongoDB | Node.js