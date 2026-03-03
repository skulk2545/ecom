# HD Foods and Masale 🌶️🍪

An authentic Maharashtrian E-commerce platform dedicated to bringing homemade Khakhra, spices, and flavored ice to your doorstep. Built with a modern tech stack focusing on a premium user experience and robust administrative control.

🔗 **Live Repository:** [https://github.com/skulk2545/ecom](https://github.com/skulk2545/ecom)

---

## ✨ Features

- **🛍️ Premium Shopping Experience**: Consistent, beautiful across all pages (Home, Products, Our Story).
- **🔒 Secure Authentication**: JWT-based login and registration for Customers and Admins.
- **📦 Professional Order History**: A dedicated, beautifully redesigned "My Orders" dashboard for tracking purchases.
- **🛒 Dynamic Cart**: Seamless add-to-cart functionality with "Login to Buy" prompts for anonymous users.
- **⚡ Fast Search & Filter**: Instant filtering for **KHAKRA** and **FLAVOURED ICE**.
- **🛠️ Admin Dashboard**: Full Inventory management (CRUD), Order tracking, and Sales statistics.

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**: For a fast, optimized single-page application.
- **React Router Dom**: Client-side routing with protected routes.
- **Axios**: API communication with global client configuration.
- **Context API**: Global state management for Authentication and Cart.
- **Vanilla CSS**: Custom styling for a unique "HD Foods" brand aesthetic.

### Backend
- **FastAPI**: High-performance Python web framework.
- **SQLAlchemy**: Powerful SQL toolkit and Object-Relational Mapper (ORM).
- **Pydantic**: Data validation and settings management.
- **JWT (JOSE)**: Secure token-based authentication.
- **SQLite**: Reliable local database (designed for easy expansion to PostgreSQL).

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [Python](https://www.python.org/) (3.9+)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/skulk2545/ecom.git
   cd ecom
   ```

2. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   *Frontend will be running on [http://localhost:5173](http://localhost:5173)*

3. **Backend Setup:**
   ```bash
   cd ../backend
   # Recommended: Create a virtual environment
   python -m venv venv
   source venv/bin/activate # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```
   *Backend API and Docs available at [http://localhost:8000/docs](http://localhost:8000/docs)*

---

## 📂 Project Structure

```text
ecom/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI (Navbar, Footer, ProductCard, etc.)
│   │   ├── pages/        # Main views (Home, Landing, Orders, Auth)
│   │   ├── state/        # Auth and Cart context providers
│   │   └── api/          # Axios client setup
├── backend/              # FastAPI application
│   ├── app/
│   │   ├── models/       # DB Schemas (SQLAlchemy)
│   │   ├── routers/      # API Endpoints
│   │   ├── schemas/      # Pydantic data validation
│   │   └── core/         # Security and Config
└── README.md
```

---

## 📍 Contact Us
- **Address**: Plot 42, Masale Lane, Pune.
- **Ph**: +91 98765 43210
- **Email**: hello@hdfoods.com

---

© 2026 HD Foods and Masale. Authentic Flavours, Homemade Love.
