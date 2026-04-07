# Hironix - Modern HR Management System

A full-stack MERN application for employee management, attendance tracking, leave management, and skill matrix.

## 🎉 Current Status: Phase 2 Complete

### Phase 1: Foundation ✅
- React + Vite + Tailwind frontend
- Express + MongoDB backend
- Project structure and tooling

### Phase 2: Core UI Shell and Brand System ✅
- Prism animated background system
- Complete UI component library (Button, Input, Card, Badge, Table)
- Layout components (Navigation, AppShell, PageHeader)
- Landing page with hero section
- Login page with authentication UI
- Admin and Employee dashboard shells

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- MongoDB installed or MongoDB Atlas account

### Installation

1. **Clone the repository**
   ```bash
   cd Hironix
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   npm install ogl  # For Prism background animation
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure Environment Variables**
   - Copy `.env.example` to `.env` in both `frontend` and `backend`
   - Update MongoDB connection string in `backend/.env`

5. **Start Development Servers**
   
   Terminal 1 - Backend:
   ```bash
   cd backend
   npm run dev
   ```
   
   Terminal 2 - Frontend:
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Demo Login Credentials
- **Admin**: `admin@hironix.com` (any password)
- **Employee**: `employee@hironix.com` (any password)

## 📁 Project Structure

```
Hironix/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── background/  # Prism background system
│   │   │   ├── layout/      # Navigation and shells
│   │   │   └── ui/          # UI primitives
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app with routing
│   └── package.json
├── backend/               # Express + MongoDB backend
│   ├── src/
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── server.js     # Express server
│   └── package.json
└── docs/                 # Documentation
    ├── 01-product-requirements-document.md
    ├── 09-development-plan.md
    └── PHASE-2-COMPLETE.md
```

## 📚 Documentation

See `/docs` folder for:
- Product Requirements Document
- Feature Breakdown
- System Design
- Database Schema
- API Design
- Frontend Architecture
- UI/UX Wireframes
- Development Plan (10 phases)

## 🎨 Tech Stack

**Frontend:**
- React 18 with Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- OGL for WebGL animations

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication (Phase 3)
- Bcrypt for password hashing (Phase 3)

## 🔄 Development Phases

- [x] **Phase 1**: Foundation and Project Setup
- [x] **Phase 2**: Core UI Shell and Brand System
- [ ] **Phase 3**: Authentication and Access Control
- [ ] **Phase 4**: Employee Management Module
- [ ] **Phase 5**: Attendance Management Module
- [ ] **Phase 6**: Leave Management Module
- [ ] **Phase 7**: Skill Matrix Module
- [ ] **Phase 8**: Dashboard Insights Module
- [ ] **Phase 9**: Product Polish and Consistency
- [ ] **Phase 10**: Hardening, Testing, and Deployment

## 🎯 Next Steps

**Ready for Phase 3: Authentication and Access Control**
- Implement User model with bcrypt password hashing
- Create login/register endpoints with JWT
- Add authentication middleware
- Implement protected routes
- Add role-based access control

## 📄 License

This project is created for portfolio demonstration purposes.

_Repository note: minor README maintenance update._
