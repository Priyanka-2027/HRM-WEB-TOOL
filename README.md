# <p align="center">🌌 Hironix: The Glassmorphic HRM Engine</p>

<p align="center">
  <img src="Hironix.png" alt="Hironix Banner" width="200" />
</p>

<p align="center">
  <strong>The Future of Workforce Orchestration.</strong><br>
  Built on the MERN stack with a focus on <em>Industrial-Grade Visual Engineering</em> and <em>Dual-Theme Accessibility</em>.
</p>

---

## 💎 Project Overview

Hironix is a state-of-the-art Human Resource Management (HRM) platform designed to bridge the gap between enterprise-level functionality and premium consumer-grade aesthetics. Featuring a revolutionary **Dual-Theme Glassmorphic interface**, Hironix provides a seamless experience for Employees, Managers, and Administrators alike.

### 🌟 Key Highlights
- **Premium v3.0 Architecture**: Stabilized production-ready codebase with optimized state management.
- **Visual Excellence**: Industry-leading glassmorphism with dynamic backdrop blurring and real-time glow effects.
- **Intelligent Onboarding**: A differentiated registration system that identifies user intent (Talent vs. Manager) at the point of origin.

---

## 🏛️ System Architecture

### 🌓 Dual-Theme Revolution
Hironix transitions beyond "Dark Mode" to offer a fully responsive dual-theme design system.
*   **Adaptive Glassmorphism**: High-blur transparency in Dark Mode; clean, high-readiness surfaces in Light Mode.
*   **Centralized Token System**: A unified design system managed via `ThemeContext` and optimized CSS variables for instant theme toggling.
*   **Intelligent Contrast**: High-precision contrast ratios tailored for professional administrative environments.

### 🔑 Advanced Authentication & RBAC
*   **Universal Login Flow**: A role-agnostic entry point that intelligently routes users to their respective dashboards based on validated database roles.
*   **Role-Specific Onboarding**: Distinct registration portals for **Talent** and **Managers**, ensuring every account is provisioned with the correct permissions from day one.
*   **Automated Profile Splicing**: Atomic synchronization between auth credentials and employee data structures to prevent data fragmentation.

### 📊 Dashboard Modules
*   **Employee Portal**: Personal KPI tracking, automated payroll visibility, skill matrices, and notification centers.
*   **Manager Hub**: Team performance analytics, resource allocation tools, and streamlined approval engines.
*   **Admin Control**: Global system configuration, broadcast announcement management, and total workforce oversight.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Tailwind CSS, Framer Motion, Axios, Lucide Icons |
| **Backend** | Node.js, Express, MongoDB Atlas, Mongoose |
| **Animation** | OGL (WebGL) for Prism backgrounds, CSS3 Glassmorphism |
| **Deployment** | Vercel (Backend), Netlify (Frontend) |

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v16.x or higher)
- MongoDB Cluster
- Git

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/YourRepo/Hironix.git

# Setup Frontend
cd frontend && npm install

# Setup Backend
cd ../backend && npm install
```

### 3. Execution
Create environment files in both `frontend/` and `backend/` directories, then launch:
```bash
# Terminal A (Backend)
npm run dev

# Terminal B (Frontend)
npm run dev
```

---

<p align="center">
  <em>Hironix v3.0 — Precision Engineering for the Modern Workforce.</em><br>
  Built with ❤️ for High-Fidelity Product Exploration.
</p>
