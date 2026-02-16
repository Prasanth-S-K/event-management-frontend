# 🎉 Event Management Application

A full-stack Event Management Application built using the MERN stack.  
Users can create events, register for events, cancel registrations, and manage their own events.

---

## 🚀 Live Links

🔗 Frontend: https://event-management-frontend-zeta-nine.vercel.app/  
🔗 Backend: https://event-management-backend-ysg0.onrender.com

---

## 🛠 Tech Stack

### Frontend

- React (Vite)
- Axios
- React Router
- Bootstrap / CSS

### Backend

- Node.js
- Express.js
- MongoDB (MongoDB Atlas)
- Mongoose
- JWT Authentication

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## ✨ Features

### 👤 Authentication

- User registration
- User login
- JWT-based authentication
- Protected routes

### 📅 Event Management

- Create event
- Edit event
- Delete event
- Pagination support
- Capacity management

### 🎟 Event Registration

- Register for event
- Cancel registration
- Prevent duplicate registrations
- Capacity validation
- Prevent registration for past events

### 📊 Dashboard

- View "My Registrations"
- Event creator can view registered users

---

## 📂 Project Structure

root
├── client (React frontend)
└── server (Node/Express backend)

---

## ⚙️ Environment Variables

### Backend (.env)

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

---

## 🧪 Run Locally

### Backend

cd server
npm install
node seed/seedEvents.js
npm run dev

### Frontend

cd client
npm install
npm run dev

---

## 📌 Future Improvements

- Admin dashboard with analytics
- Payment integration
- Email notifications
- Event image uploads
- Search & filtering
- UI improvements

---

## 👨‍💻 Author

Prasanth-S-K
GitHub: https://github.com/Prasanth-S-K

---

## 📜 License

This project is for educational purposes.
