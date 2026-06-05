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
- [Getting Started](#-getting-started)
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
| **Routing** | ![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=flat-square&logo=react-router&logoColor=white) | Client-side navigation |
| **Animation** | ![Framer](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white) | UI animations & transitions |
| **Charts** | ![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white) ![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=flat-square) | Data visualization |
| **Backend** | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) | Auth, Firestore, Hosting |
| **CI/CD** | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=flat-square&logo=githubactions&logoColor=white) | Automated testing & deployment |
| **Linting** | ![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=white) | Code quality enforcement |

</div>

---

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Frontend (React 19 + Vite)"]
        LP[Landing Page]
        Auth[Authentication]
        AD[Admin Dashboard]
        TD[Teacher Dashboard]
        SD[Student Dashboard]
        PD[Parent Dashboard]
    end

    subgraph State["📦 State Management"]
        Redux[Redux Toolkit]
        Context[Auth Context]
    end

    subgraph Backend["☁️ Firebase Backend"]
        FA[Firebase Auth]
        FS[Cloud Firestore]
        FH[Firebase Hosting]
    end

    subgraph DevOps["🔄 CI/CD"]
        GA[GitHub Actions]
        Deploy[Auto Deploy]
    end

    LP --> Auth
    Auth --> Context
    Context --> AD & TD & SD & PD
    AD & TD & SD & PD --> Redux
    Redux --> FS
    Auth --> FA
    GA --> Deploy --> FH

    style Client fill:#1a1b27,stroke:#6c63ff,color:#fff
    style State fill:#1a1b27,stroke:#764ba2,color:#fff
    style Backend fill:#1a1b27,stroke:#ffca28,color:#fff
    style DevOps fill:#1a1b27,stroke:#2088ff,color:#fff
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **Firebase CLI** (for deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShelumHansana/SmartED.git
   cd SmartED
   ```

2. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Configure Firebase**
   
   Create a Firebase project at [Firebase Console](https://console.firebase.google.com/) and update `frontend/src/utils/firebase.js` with your configuration:
   ```javascript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

5. **Start the development server**
   ```bash
   cd ../frontend
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

### Firebase Deployment

```bash
# Build the frontend
cd frontend
npm run build

# Deploy to Firebase Hosting
cd ..
firebase deploy --only hosting
```

> 💡 **Tip:** Push to the `main` branch triggers automatic deployment via GitHub Actions!

---

## 📁 Project Structure

```
SmartED/
├── 📂 .github/
│   └── workflows/              # CI/CD pipeline configuration
│       ├── firebase-hosting-merge.yml
│       └── firebase-hosting-pull-request.yml
├── 📂 backend/
│   ├── firebase/config.js      # Firebase configuration
│   ├── index.js                # Backend entry point
│   ├── scripts/                # Database initialization scripts
│   ├── services/               # Business logic layer
│   │   ├── adminService.js     # Admin operations
│   │   ├── authService.js      # Authentication logic
│   │   ├── dbInitService.js    # Database setup
│   │   └── userService.js      # User management
│   └── utils/                  # Shared utilities
├── 📂 frontend/
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── dashboard/      # Student dashboard modules
│   │   │   └── teacher/        # Teacher-specific components
│   │   ├── contexts/           # React Context providers
│   │   ├── data/               # Static data & constants
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── styles/             # CSS stylesheets
│   │   │   └── teacher/        # Teacher-specific styles
│   │   └── utils/              # Frontend utilities
│   ├── index.html              # App entry point
│   ├── vite.config.js          # Vite configuration
│   └── package.json            # Frontend dependencies
├── firebase.json               # Firebase hosting config
├── CONTRIBUTING.md             # Contribution guidelines
├── CODE_OF_CONDUCT.md          # Community guidelines
├── SECURITY.md                 # Security policy
├── LICENSE                     # MIT License
└── README.md                   # This file
```

---

## 📖 Documentation

| Document | Description |
|---|---|
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Step-by-step deployment instructions |
| [CONTRIBUTING.md](CONTRIBUTING.md) | How to contribute to SmartED |
| [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) | Community behavior guidelines |
| [SECURITY.md](SECURITY.md) | Security vulnerability reporting |

---

## 🗺️ Roadmap

- [x] Multi-role authentication system
- [x] Admin dashboard with user management
- [x] Teacher grade entry & analytics
- [x] Student progress dashboard
- [x] Parent monitoring portal
- [x] Firebase CI/CD pipeline
- [ ] Mobile-responsive optimization
- [ ] Push notifications
- [ ] Attendance tracking module
- [ ] Timetable management
- [ ] Report card generation (PDF)
- [ ] Multi-language support (Sinhala/Tamil/English)
- [ ] PWA support for offline access
- [ ] API documentation with Swagger

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 🙏 Acknowledgments

- [React](https://react.dev/) — UI library
- [Firebase](https://firebase.google.com/) — Backend services
- [Vite](https://vitejs.dev/) — Build tool
- [Chart.js](https://www.chartjs.org/) & [Recharts](https://recharts.org/) — Data visualization
- [Framer Motion](https://www.framer.com/motion/) — Animations
- [Shields.io](https://shields.io/) — Badges

---

<div align="center">

**Built with ❤️ by [Shelum Hansana](https://github.com/ShelumHansana)**

⭐ Star this repo if you find it helpful!

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:667eea,100:764ba2&height=100&section=footer" width="100%" />

</div>
