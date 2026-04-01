# LifePathBot - AI-Powered Student Success Frontend

The frontend for the LifePathBot platform, designed with a modern, dark-themed, glassmorphic UI using React, TypeScript, and Tailwind CSS.

## ✨ Features

- **Dynamic Chat Interface**: Switch between **Study Mode** (document-based) and **General Mode**.
- **Multi-File Support**: Secure upload and parsing for PDF, DOCX, and PPTX.
- **Glassmorphic Dashboard**: Real-time stats, mood tracking, and goal charts.
- **Goal Management**: Interactive SMART goal tracking.
- **Calendar & Motivation**: Visual views of your upcoming academic schedule and goals.
- **Firebase Auth Integration**: Secure user authentication and profiles.

---

## 🛠️ Tech Stack

- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **State Management**: [React Context](https://reactjs.org/docs/context.html)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/) + [MUI Icons](https://mui.com/material-ui/material-icons/)
- **Charts**: [Recharts](https://recharts.org/)
- **Auth**: [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Toast Notifications**: [Sonner](https://sonner.emilkowal.ski/)

---

## 🏗️ Getting Started (Frontend Setup)

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### 2. Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/AI-Mercenary/lifepath-bot-frontend.git
   cd lifepath-bot-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (.env):
   ```env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_AUTH_DOMAIN=your_domain
   VITE_FIREBASE_PROJECT_ID=your_id
   VITE_FIREBASE_STORAGE_BUCKET=your_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   VITE_API_URL=http://localhost:5000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:8080`.

---

## 🔗 Connection to Backend
Ensure your backend is running at `http://localhost:5000` and Ollama is running `llama3.2:1b` for the full chat experience.

---

## 📜 Project Structure
```
src/
├── api/          # Axios wrappers for backend routes
├── components/   # Reusable UI components (shadcn/ui)
├── context/      # App context (User, Goals, Reflections)
├── lib/          # Utilities, LLM types, and detectIntent logic
├── pages/        # Main route pages (Dashboard, Chat, Goals, Auth)
└── App.tsx       # Main component routing
```

---

## 📄 License
MIT
