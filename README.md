<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=200&section=header&text=SmartED&fontSize=70&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=School%20Management%20Platform&descSize=20&descAlignY=55&descColor=e0e0ff" width="100%" />

<br/>

[![License: MIT](https://img.shields.io/badge/License-MIT-6c63ff.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Deploy](https://img.shields.io/badge/Deploy-Firebase_Hosting-039BE5?style=for-the-badge&logo=firebase&logoColor=white)](https://smart-ed-b7023.web.app)
[![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)](.github/workflows)

<br/>

**A comprehensive, role-based school management platform built with modern web technologies.**
**Empowering administrators, teachers, students, and parents with real-time data & analytics.**

[🌐 Live Demo](https://smart-ed-b7023.web.app) · [📖 Documentation](#-documentation) · [🐛 Report Bug](https://github.com/ShelumHansana/SmartED/issues/new?template=bug_report.md) · [✨ Request Feature](https://github.com/ShelumHansana/SmartED/issues/new?template=feature_request.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Documentation](#-documentation)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 🔍 Overview

**SmartED** is a full-stack school management system designed specifically for the Sri Lankan education context. It provides a unified platform where different stakeholders — administrators, teachers, students, and parents — can interact through role-specific dashboards with real-time data synchronization.

### 🎯 Problem Statement

Traditional school management relies on paper-based systems and fragmented digital tools, leading to:
- Inefficient grade tracking and reporting
- Poor communication between teachers and parents
- Limited visibility into student progress
- Manual, error-prone administrative processes

### 💡 Solution

SmartED digitizes the entire school management workflow with:
- **Role-based access control** ensuring data security and relevant interfaces
- **Real-time analytics** for data-driven decisions
- **Automated CI/CD pipeline** for seamless deployments
- **Responsive design** that works across all devices

---

## ✨ Features

<div align="center">

| 🔐 **Admin Dashboard** | 👨‍🏫 **Teacher Dashboard** |
|---|---|
| User & role management | Grade entry & analytics |
| Course configuration | Student performance tracking |
| System-wide reporting | Assignment management |
| Settings & customization | Message board & communication |

| 🎒 **Student Dashboard** | 👨‍👩‍👧 **Parent Dashboard** |
|---|---|
| Academic progress overview | Multi-child monitoring |
| Assignment tracking | Grade & performance viewing |
| Exam marks & analytics | Teacher communication |
| Calculator & notes tools | Academic progress reports |

</div>

### Key Highlights

- 🏫 **4 Role-Based Dashboards** — Tailored experiences for Admin, Teacher, Student & Parent
- 📊 **Interactive Analytics** — Grade analytics with Chart.js & Recharts visualizations
- 🔐 **Secure Authentication** — Firebase Auth with protected routes and role validation
- 📱 **Fully Responsive** — Optimized for desktop, tablet, and mobile
- ✨ **Smooth Animations** — Powered by Framer Motion for professional UX
- 🚀 **Automated Deployment** — CI/CD via GitHub Actions to Firebase Hosting
- 🔥 **Real-time Sync** — Firebase Firestore for live data updates
- 🇱🇰 **Localized** — Designed for the Sri Lankan education system

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend** | ![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black) | UI components & rendering |
| **Build Tool** | ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) | Fast development & bundling |
| **State Management** | ![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white) | Global state management |
| **Routing** | ![React Router](https://img.shields.io/badge/React_Router_v6-CA4245?style=flat-square&logo=react-router&logoColor=white) | Client-side routing |
| **Animation** | ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | Page transitions & UI animations |
| **Charts** | ![Chart.js](https://img.shields.io/badge/Chart.js_+_Recharts-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) | Data visualization |
| **Authentication** | ![Firebase Auth](https://img.shields.io/badge/Firebase_Auth-FFCA28?style=flat-square&logo=firebase&logoColor=black) | User login & role management |
| **Database** | ![Firestore](https://img.shields.io/badge/Cloud_Firestore-039BE5?style=flat-square&logo=firebase&logoColor=white) | NoSQL real-time database |
| **Hosting** | ![Firebase](https://img.shields.io/badge/Firebase_Hosting-FFA611?style=flat-square&logo=firebase&logoColor=white) | Production deployment |
| **CI/CD** | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) | Automated testing & deployment |

</div>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Frontend (React 19 + Vite)"]
        UI["UI Components"]
        Redux["Redux Toolkit Store"]
        Router["React Router v6"]
        FM["Framer Motion"]
    end

    subgraph Auth["🔐 Authentication"]
        FA["Firebase Auth"]
        RG["Role Guard"]
    end

    subgraph Backend["☁️ Firebase Backend"]
        FS["Cloud Firestore"]
        FH["Firebase Hosting"]
    end

    subgraph CI["⚙️ DevOps"]
        GA["GitHub Actions"]
    end

    UI --> Redux
    UI --> Router
    UI --> FM
    Router --> RG
    RG --> FA
    FA --> FS
    Redux --> FS
    GA --> FH
```

---

## 📸 Screenshots

> **📌 Coming Soon** — Screenshots of each dashboard will be added here.
> 
> If you'd like to see the app in action, check out the [Live Demo](https://smart-ed-b7023.web.app).

<!--
Uncomment and add your screenshots:

<div align="center">
<img src="screenshots/admin-dashboard.png" width="45%" />
<img src="screenshots/teacher-dashboard.png" width="45%" />
<img src="screenshots/student-dashboard.png" width="45%" />
<img src="screenshots/parent-dashboard.png" width="45%" />
</div>
-->

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ and **npm** v9+
- A **Firebase** project with Firestore and Authentication enabled
- **Git** installed

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ShelumHansana/SmartED.git
cd SmartED

# 2. Install dependencies
npm install

# 3. Set up environment variables (see below)
cp .env.example .env

# 4. Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 🔑 Environment Variables

Create a `.env` file in the root directory with your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

> **Note:** Never commit your `.env` file. It's already included in `.gitignore`.

---

## 📁 Project Structure

```
SmartED/
├── .github/
│   └── workflows/         # CI/CD pipeline configurations
├── public/                # Static assets
├── src/
│   ├── assets/            # Images, icons, fonts
│   ├── components/        # Reusable UI components
│   │   ├── common/        # Shared components (buttons, cards, etc.)
│   │   ├── admin/         # Admin-specific components
│   │   ├── teacher/       # Teacher-specific components
│   │   ├── student/       # Student-specific components
│   │   └── parent/        # Parent-specific components
│   ├── pages/             # Page-level components
│   ├── store/             # Redux Toolkit slices & store
│   ├── services/          # Firebase service functions
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions & constants
│   ├── routes/            # Route configurations & guards
│   ├── App.jsx            # Main application component
│   └── main.jsx           # Entry point
├── .env.example           # Environment template
├── firebase.json          # Firebase configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies & scripts
```

---

## 📖 Documentation

| Resource | Link |
|---|---|
| 🌐 Live Application | [smart-ed-b7023.web.app](https://smart-ed-b7023.web.app) |
| 🐛 Bug Reports | [GitHub Issues](https://github.com/ShelumHansana/SmartED/issues) |
| ✨ Feature Requests | [GitHub Issues](https://github.com/ShelumHansana/SmartED/issues) |

---

## 🗺️ Roadmap

- [x] Role-based authentication system
- [x] Admin dashboard with user management
- [x] Teacher grade entry & analytics
- [x] Student academic progress view
- [x] Parent monitoring portal
- [x] CI/CD pipeline with GitHub Actions
- [ ] Push notifications for parents
- [ ] Multi-language support (Sinhala, Tamil, English)
- [ ] Offline mode with service workers
- [ ] Mobile app version (React Native)
- [ ] Advanced analytics & reporting

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'feat: add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please ensure your code follows the existing style and all tests pass.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://react.dev/) — UI library
- [Firebase](https://firebase.google.com/) — Backend-as-a-Service
- [Vite](https://vitejs.dev/) — Build tool
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/) — Data visualization
- [Redux Toolkit](https://redux-toolkit.js.org/) — State management

---

<div align="center">

**Built with ❤️ by [Shelum Hansana](https://github.com/ShelumHansana)**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=120&section=footer" width="100%" />

</div>
