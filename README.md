# AK Store - Inventory Management System

A modern inventory management system built with React, TypeScript, Node.js, and MySQL.

## Features

- User Authentication (Login/Register)
- Dashboard with Product Overview
- Product Management (CRUD operations)
- Real-time Stock Monitoring
- Responsive Design
- Search and Filter Products
- Pagination
- Category Management

## Tech Stack

### Frontend
- React 18
- TypeScript
- Material-UI (MUI)
- React Query
- React Router
- Vite

### Backend
- Node.js
- Express
- TypeScript
- MySQL
- JWT Authentication
- CORS

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MySQL
- Git

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/ak-store.git
cd ak-store
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd server
npm install
```

4. Configure environment variables
- Create a `.env` file in the server directory
- Add the following variables:
```env
PORT=5000
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-secret-key
```

5. Create the database tables
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  quantity INT NOT NULL,
  category VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Running the Application

1. Start the backend server
```bash
cd server
npm run dev
```

2. Start the frontend development server
```bash
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Features in Detail

### Authentication
- User registration with email and password
- JWT-based authentication
- Protected routes

### Dashboard
- Overview of all products
- Quick stock status indicators
- Search and filter functionality
- Responsive grid layout

### Product Management
- Add new products
- Edit existing products
- Delete products
- View product details
- Stock level monitoring
- Category-based organization

### User Interface
- Modern Material-UI components
- Responsive design for all screen sizes
- Intuitive navigation
- Real-time feedback
- Form validation
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Material-UI for the awesome component library
- React Query for efficient data fetching
- Express.js for the robust backend framework
