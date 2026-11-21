# HealthCheck – Personal Health Monitoring System

A responsive personal health monitoring web application built with React, TypeScript, Vite, and Tailwind CSS.

## Core Modules

- **Home Dashboard**: Personalized greeting, overview of logged daily metrics, and quick access to every health tool.
- **Symptom Checker**: Structured symptom selection or custom entry with follow-up screening questions, general self-care guidance, urgent warning-sign checks, and explicit non-diagnostic medical disclaimers.
- **BMI Calculator**: Automatic Body Mass Index calculation from kilograms and centimeters, category visualization, optional measurement log, and educational screening disclaimer.
- **Daily Wellness Tracker**: Functional logging for daily water intake, sleep duration and quality, and physical activities with customizable daily targets.
- **Health Tips**: Practical guidance covering healthy eating, hydration, exercise, sleep, and personal wellness.
- **User Account (Firebase Auth Ready)**: Registration, Gmail (Google) sign-in, email login, and logout wired to the official Firebase Web SDK without simulated authentication.

## Local Development

```bash
npm install
npm run dev
```

## Firebase Authentication Setup

1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Register a Web App and enable **Email/Password** and **Google** providers under **Authentication > Sign-in method**.
3. Copy `.env.example` to `.env` and fill in your `VITE_FIREBASE_*` values.
4. Restart the development server (`npm run dev`).

## GitHub & Netlify Deployment

1. Push this repository to GitHub.
2. In Netlify, click **Add new site > Import an existing project** and connect your GitHub repository.
3. Netlify automatically detects `netlify.toml` (`npm run build`, publish directory `dist`, SPA redirect `/* -> /index.html`).
4. Add your `VITE_FIREBASE_*` keys under **Site configuration > Environment variables** and trigger a deploy.
