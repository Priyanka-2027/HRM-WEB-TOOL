# Hironix - Modern HR Management System

A full-stack MERN application for employee management, attendance tracking, leave management, skill matrix, and payroll estimation.

## 🚀 Current Status: Platform Stabilized & UI Overhauled

Hironix has evolved into a production-ready HRM solution with a premium glassmorphic aesthetic and robust backend validation.

### Core Modules & Features

#### 💎 Premium UI System
- **Glassmorphism 2.0**: Ultra-modern UI with backdrop blurring, border-glow effects, and dynamic glass components.
- **Micro-animations**: Interaction-driven feedback using `framer-motion` for a state-of-the-art experience.
- **WebGL Background**: Immersive Prism-animated background system.

#### 🔐 Auth & Onboarding Automation
- **Robust Validation**: Real-time email and password strength verification.
*   **Automatic Account Linking**: New registrants automatically receive a "Pending Onboarding" employee profile, ensuring they are immediately manageable by HR and visible in Admin dashboards.

#### 📈 Dashboard & Insights
- **Employee HUD**: Personal performance metrics, skill maps, and attendance donut charts.
- **Admin Command Center**: Real-time organization-wide statistics and management overviews.
- **Deep-Linking**: Seamless navigation from employee profiles directly to filtered attendance, leave, or skill records.

#### 💰 Payroll Module
- **Payout Estimation**: Real-time calculation of projected monthly salary based on current attendance and approved paid leaves.
- **Full Calculation Breakdown**: Transparent modal view showing the base salary, total payable days, and the underlying calculation formula.

#### 📊 Skill Matrix
- **Competency Mapping**: Radial radar charts for skill visualization.
- **Library Management**: Centralized master skill catalog and proficiency level tracking (Beginner to Expert).

---

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
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure Environment Variables**
   - Create `.env` in `backend/` with:
     ```env
     PORT=5000
     MONGO_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     JWT_EXPIRE=30d
     ```

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

## 📁 Project Structure

```
Hironix/
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── background/  # Prism background system
│   │   │   ├── layout/      # Navigation and shells
│   │   │   └── ui/          # UI primitives (GlassSelect, BorderGlow)
│   │   ├── pages/         # Page components
│   │   └── App.jsx        # Main app with routing
├── backend/               # Express + MongoDB backend
│   ├── src/
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   └── server.js     # Express server
└── docs/                 # Documentation
```

## 🎨 Tech Stack

**Frontend:**
- **Core**: React 18 with Vite
- **Styling**: Vanilla CSS + Tailwind Utility Classes
- **Motion**: Framer Motion
- **Graphics**: OGL (WebGL)
- **Icons**: Lucide React

**Backend:**
- **Logic**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Auth**: JWT + Bcrypt

## 🔄 Development Roadmap

- [x] **Phase 1-9**: Core Module Development & Initial UI.
- [x] **Phase 10**: **Stabilization & Premium Polish**
    - [x] Resolve route shadowing errors.
    - [x] Implement robust auth validation.
    - [x] Automate user-employee account linkage.
    - [x] Deploy premium glassmorphic UI overhaul.
    - [x] Complete Payroll breakdown module.

## 📄 License

This project is created for portfolio demonstration purposes.

_Last updated: April 23, 2026_
