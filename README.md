# LifePathBot - AI-Powered Student Goal Tracker

A comprehensive student life management application with AI-powered chatbot, goal tracking, daily reflections, analytics, and more.

## Features

- **Authentication & User Management**: Registration, login, profile management
- **AI Chatbot**: Powered by Gemini Flash 2.0 with natural language processing
- **Goal Management**: SMART goals with progress tracking, deadlines, and categories
- **Daily Reflections**: Mood tracking, productivity logging, and journal entries
- **Analytics & Reports**: Weekly summaries with visual charts and trends
- **Calendar View**: Visual calendar with goals, tasks, and reflections
- **Motivation Board**: Quotes, tips, and success stories
- **Exam Mode**: High-focus mode for exam periods
- **Notifications**: Customizable reminder system
- **Data Export**: Privacy-compliant data export functionality

## Technologies

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React** - UI framework
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Recharts** - Data visualization
- **Gemini API** - AI chatbot integration

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd lifepathbot-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Gemini API key:
   ```
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   - Get your API key from: https://makersuite.google.com/app/apikey

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/     # Reusable UI components
├── context/        # React context for state management
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and API integrations
├── pages/          # Page components
└── App.tsx         # Main application component
```

## Backend Integration

This frontend is designed to work with a MongoDB backend. See the API documentation for the required endpoints.

## License

MIT
