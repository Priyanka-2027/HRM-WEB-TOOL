# 🌌 Hironix: The Glassmorphic HRM Engine

> **Educational Repository**: A deep-dive into full-stack architecture, real-time data synchronization, and premium aesthetic engineering.

Hironix is not just a human resource management tool; it is a curriculum in modern web development. Built to demonstrate the synergy between **MERN Stack** power and **Glassmorphic** design excellence, this project serves as a blueprint for high-performance enterprise applications.

---

## 🏛️ Architectural Blueprint

### 1. The Glassmorphic UI System
Hironix leverages a custom-built design system to achieve an "os-native" feel within the browser.
- **Backdrop-Blur Overlays**: Utilizing `backdrop-filter: blur()` for depth.
- **Dynamic Glow Borders**: Custom components that calculate lighting based on parent state.
- **Prism Background**: A WebGL-powered animated background using `OGL` to minimize CPU overhead while maximizing aesthetic impact.

### 2. Intelligent Data Linking (Onboarding Engine)
A core educational takeaway is the **Automatic Account Linkage**.
- **The Problem**: Traditionally, User accounts and Employee profiles are disconnected.
- **The Hironix Solution**: A backend trigger in `auth.controller.js` that atomically creates a "Pending Onboarding" employee profile upon user registration. This ensures immediate data consistency across the entire ecosystem.

### 3. Contextual Awareness (Role-Based Logic)
- **Role-Gated Routing**: Strict RBAC (Role-Based Access Control) using React Router and protected backend middlewares.
- **Adaptive UI**: The shared `AppTopNav` component dynamically reconfigures its search capabilities and **Notification Sets** based on the authenticated user's role.

---

## 🧪 Educational Modules

### 📡 Real-Time State & Memoization
Observe `EmployeeDashboardPage.jsx` to see how multiple async data streams (Announcements, Summary, Payroll) are managed with `useEffect` and optimized using `useMemo` for heavy chart computations.

### 💰 Payroll Logic (Pro-Rata Computation)
The payroll module demonstrates how to calculate earnings based on dynamic inputs:
```js
Earnings = (Base_Salary / Days_In_Month) * (Effective_Present_Days + Paid_Leaves)
```
Located in `backend/src/controllers/payroll.controller.js`, this module teaches business logic implementation in a RESTful environment.

---

## 🚀 Deployment Handbook

Hironix is pre-configured for modern cloud deployment.

### 🌐 Frontend (Netlify Ready)
The [frontend/netlify.toml](frontend/netlify.toml) handles:
- Optimized production builds.
- SPA (Single Page Application) routing to prevent 404s on deep-links.

### ⚙️ Backend (Vercel Ready)
The [backend/vercel.json](backend/vercel.json) handles:
- Serverless Node.js execution.
- API route aliasing.

---

## 🛠️ Local Assembly Guide

### 1. Core Installation
```bash
# Clone the heart of the engine
git clone https://github.com/YourRepo/Hironix.git

# Initialize the UI
cd frontend && npm install

# Initialize the Intelligence
cd ../backend && npm install
```

### 2. Synchronization (Environment)
Configure your `.env` files in both directories following the provided examples. Ensure your `MONGO_URI` is active.

### 3. Ignition
```bash
# Start Backend (Terminal A)
npm run dev

# Start Frontend (Terminal B)
npm run dev
```

---

## 📄 Final Credits
Created with ❤️ for the purpose of architectural exploration and engineering education.

_Engine Version: 2.0 (Stabilized & Polished)_
