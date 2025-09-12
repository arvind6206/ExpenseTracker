# Expense Tracker Application

A full-stack expense tracking application built with React, Node.js, Express, and MongoDB. This application helps users track their income and expenses with an intuitive user interface and powerful reporting features.

![Expense Tracker Screenshot](https://via.placeholder.com/800x500.png?text=Expense+Tracker+Screenshot)

## Features

- 📊 Dashboard with expense/income summary
- 💰 Add, edit, and delete transactions
- 📈 Visual reports and analytics
- 🔐 User authentication and authorization
- 📱 Responsive design for all devices
- 🔄 Real-time updates

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Tailwind CSS
- Recharts for data visualization
- Framer Motion for animations
- React Icons & Font Awesome

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- RESTful API

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/expense-tracker.git
cd expense-tracker
```

2. Install backend dependencies
```bash
cd server
npm install
```

3. Install frontend dependencies
```bash
cd ../client
npm install
```

4. Set up environment variables
Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the development servers

In the server directory:
```bash
npm run dev
```

In the client directory:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Project Structure

```
expense-tracker/
├── client/                 # Frontend React application
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── context/        # React context providers
│       └── pages/          # Page components
└── server/                 # Backend Node.js/Express application
    ├── config/             # Configuration files
    ├── controllers/        # Route controllers
    ├── middleware/         # Custom middleware
    ├── models/             # MongoDB models
    └── routes/             # API routes
```

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server
- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


