# Simple E-Commerce Store

A basic full-stack E-Commerce web application that allows users to browse products, view product details, manage a shopping cart, place orders, and securely authenticate using JWT.

## Features

* User Registration & Login
* Product Listing
* Product Details Page
* Shopping Cart
* Order Processing
* JWT Authentication
* Responsive Design
* RESTful API Integration

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt.js

## Project Structure

```text
ecommerce-store/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── server.js
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json
```

## Database Collections

### Users

* Name
* Email
* Password

### Products

* Product Name
* Description
* Price
* Image URL
* Category
* Stock Quantity

### Orders

* User ID
* Products
* Total Amount
* Order Status
* Created Date

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd ecommerce-store
```

### Install Dependencies

```bash
yarn install
```

### Start Frontend

```bash
yarn workspace frontend dev
```

### Start Backend

```bash
yarn workspace backend dev
```

### Run Both Services

```bash
yarn dev
```

## Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:5000
```

## API Endpoints

### Authentication

* POST /api/auth/register
* POST /api/auth/login

### Products

* GET /api/products
* GET /api/products/:id

### Orders

* POST /api/orders
* GET /api/orders/:id

## Future Improvements

* Payment Gateway Integration
* Wishlist Feature
* Product Reviews & Ratings
* Admin Dashboard
* Inventory Management

## License

This project was developed for educational and learning purposes.
