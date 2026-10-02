# 🧠 MCQ Master

> **AI-powered examination portal, dynamic MCQ generator, and diagnostic revision platform built with Next.js 15 and Google Genkit.**

![Framework](https://img.shields.io/badge/Framework-Next.js%2015-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![AI Engine](https://img.shields.io/badge/AI-Google%20Genkit%201.20-4285F4?logo=google&logoColor=white)
![Database](https://img.shields.io/badge/Database-Firebase%2011-FFCA28?logo=firebase&logoColor=black)
![Styling](https://img.shields.io/badge/Styling-Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=white)
![Typesetting](https://img.shields.io/badge/Typesetting-KaTeX-00D8A2?logo=latex&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Active-brightgreen)

---

## 📖 Overview

**MCQ Master** is an intelligent academic revision and examination portal powered by Next.js 15, React 19, and Google Genkit AI. The platform allows students and teachers to dynamically synthesize comprehensive multiple-choice assessments from any topic or syllabus material, take timed tests with instant client-side feedback, and receive deep AI diagnostic assessments highlighting conceptual weaknesses with KaTeX-typeset step-by-step explanations.

Designed for speed and reliability, MCQ Master runs on Turbopack with Firebase App Hosting configuration (`apphosting.yaml`), blending modern web performance with frontier Gemini AI models.

---

## ✨ Key Features

- **Genkit AI Quiz Generation Flow (`generateQuizFromTopicFlow`)**: Automatically constructs rigorous multiple-choice assessments on any topic, chapter, or custom concept prompt.
- **Granular Customization Parameters**:
  - **Difficulty Levels**: Easy, Medium, and Hard question progression.
  - **Quiz Styles**: General knowledge, deep Conceptual evaluation, or quantitative Problem Solving.
  - **Context Notes**: Upload or paste custom chapter notes for focused question generation.
  - **Explanations Toggle**: Optional detailed solution derivation for every question.
- **KaTeX & Markdown Formula Typesetting**: Integrated `rehype-katex` and `remark-math` pipeline rendering complex mathematical formulas, physics notations, and chemical equations with mathematical precision.
- **AI Performance Diagnostic (`summarizeQuizResultsFlow`)**: Deep Genkit flow evaluating user answers, identifying root-cause misconceptions, and proposing concrete revision action steps.
- **Interactive Multi-View Application**:
  - **HomeView**: Intuitive quiz generator configuration cockpit.
  - **QuizView**: Distraction-free, timed examination environment with question progress indicators.
  - **ResultsView**: Detailed score breakdown, animated Recharts performance charts, and question-by-question review.
  - **HistoryView & LibraryView**: Archive of previous test attempts and repository of saved quiz sets.
- **Modern Component Architecture**: Built with accessible Radix UI primitives, React Hook Form validation, Zod schema contracts, and responsive Tailwind CSS styling.
- **Google Firebase App Hosting Ready**: Out-of-the-box `apphosting.yaml` manifest for seamless deployment on Google Cloud Firebase infrastructure.

---

## 🛠️ Tech Stack

| Category | Technology | Description |
|----------|------------|-------------|
| **Core Framework** | Next.js 15.3.6 | App Router, Server Actions, Turbopack |
| **UI Library** | React 19.2.1 | Modern concurrent React primitives |
| **AI Framework** | Google Genkit 1.20 | `@genkit-ai/google-genai`, `@genkit-ai/next`, `genkit-cli` |
| **Backend & Hosting** | Firebase 11.9.1 | Cloud Firestore, Firebase App Hosting |
| **Form & Validation** | React Hook Form & Zod | Typed schema-driven forms |
| **Math & Markdown** | KaTeX & React Markdown | `katex`, `react-markdown`, `remark-math`, `rehype-katex` |
| **Visualizations** | Recharts 2.15.1 | Performance metrics and score distribution charts |
| **Styling & Icons** | Tailwind CSS 3.4 & Lucide | Responsive modern dark/light UI tokens |

---

## 📁 Project Structure

```plaintext
MCQ-Master/
├── docs/                      # Documentation and architecture guides
├── src/
│   ├── ai/
│   │   ├── flows/
│   │   │   ├── generateQuizFromTopic.ts # AI quiz generation pipeline
│   │   │   └── summarizeQuizResults.ts  # AI mistake analysis & diagnosis
│   │   ├── dev.ts             # Genkit local development server entry
│   │   └── genkit.ts          # Genkit initialization & Gemini model setup
│   ├── app/
│   │   ├── layout.tsx         # Root layout with font and theme providers
│   │   ├── page.tsx           # Multi-view application entry point
│   │   └── globals.css        # Tailwind and KaTeX styling imports
│   ├── components/
│   │   ├── views/             # HomeView, QuizView, ResultsView, HistoryView
│   │   └── ui/                # Radix UI primitives (Dialog, Button, Card, Tabs)
│   ├── lib/                   # Utility helpers and Firebase SDK initialization
│   └── types/                 # Quiz, Question, and Diagnostic TypeScript interfaces
├── apphosting.yaml            # Google Firebase App Hosting deployment configuration
├── next.config.ts             # Next.js configuration (Turbopack, port 9002)
├── tailwind.config.ts         # Tailwind design tokens
└── tsconfig.json              # Strict TypeScript compiler options
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `20.x` or later
- **npm** or **pnpm**
- **Google Gemini API Key**: Obtainable from [Google AI Studio](https://aistudio.google.com/)
- **Firebase Project**: A Firebase web application project

### 1. Clone & Install

```bash
git clone https://github.com/AryansDevStudios/MCQ-Master.git
cd MCQ-Master
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
# Google GenAI API Key for Genkit
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Launch Development Environments

To start the Next.js development server with Turbopack (defaults to port `9002`):

```bash
npm run dev
```

Open [http://localhost:9002](http://localhost:9002) in your browser.

To launch the interactive **Genkit Developer UI** for inspecting, testing, and debugging AI flows independently:

```bash
npm run genkit:dev
```

Open [http://localhost:4000](http://localhost:4000) for the Genkit Developer Console.

---

## 📦 Production Deployment

MCQ Master is pre-configured for **Google Firebase App Hosting**:

```bash
# Build the production bundle
npm run build

# Start production server
npm start
```

For deployment to Firebase App Hosting, connect your GitHub repository in the Firebase Console. The configuration is governed automatically by `apphosting.yaml`.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/NewFeature`)
3. Commit your changes (`git commit -m 'Add new AI flow feature'`)
4. Push to your branch (`git push origin feature/NewFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
