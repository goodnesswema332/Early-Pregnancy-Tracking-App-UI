# Early Pregnancy Prevention App

**Young Scientist Kenya 2026 - Social Science Category**

An educational mobile application designed to prevent early pregnancy among Kenyan teenagers (ages 12-17) through reproductive health education, informed decision-making, and access to support services.

## Project Team

- **Presenters:** Mercy Wanjiku, Mary Muthoni
- **School:** Kiambu Township Junior School
- **Category:** Social Science

## Project Overview

This application addresses the significant issue of teenage pregnancy in Kenya, where approximately 300,000-400,000 cases occur annually. The app provides:

- Comprehensive reproductive health education
- Interactive learning through quizzes and games
- Anonymous chat support
- Access to youth-friendly health services
- Goal-setting tools for future planning
- Myth-busting content to combat misinformation

## Architecture

The project is structured as a full-stack application:

### Backend (Node.js/Express + TypeScript)

- **Location:** `backend/`
- **Technology:** Node.js, Express, MongoDB, TypeScript
- **Features:** REST API, JWT authentication, user progress tracking

### Mobile App (Expo/React Native)

- **Location:** `mobile/`
- **Technology:** Expo, React Native, TypeScript
- **Features:** Cross-platform iOS/Android app, offline support

### Legacy Web App (React)

- **Location:** `src/`
- **Status:** Prototype (being replaced by Expo mobile app)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn
- Expo CLI (for mobile development)

### Quick Start

1. **Clone the repository:**

```bash
git clone <repository-url>
cd code
```

2. **Set up the backend:**

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

3. **Set up the mobile app:**

```bash
cd mobile
npm install
npm start
```

4. **Access the application:**

- Backend API: http://localhost:5000
- Mobile app: Scan QR code with Expo Go

## Features

### Core Features

- ✅ User Authentication (Register/Login)
- ✅ Dashboard with Progress Tracking
- ✅ Educational Content Library
- ✅ FAQ Section
- ✅ Myth-Busting Module
- ✅ Anonymous Chat Support
- ✅ Health Services Locator (Kiambu area)
- ✅ Goal Setting & Tracking
- ✅ Educational Videos
- ✅ Interactive Quizzes & Games
- ✅ Achievement Badges & Streaks
- ✅ User Profile Management

### Privacy & Security

- End-to-end encryption for chat messages
- Anonymous user IDs
- No personally identifiable information (PII) collection
- Secure JWT authentication
- GDPR-compliant data handling

## Project Structure

```
.
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── models/            # MongoDB models
│   │   ├── routes/            # API routes
│   │   ├── controllers/       # Route controllers
│   │   ├── middleware/        # Auth, validation
│   │   ├── config/            # Database config
│   │   └── server.ts          # Main server file
│   ├── package.json
│   └── tsconfig.json
│
├── mobile/                     # Expo/React Native app
│   ├── src/
│   │   ├── screens/           # App screens
│   │   ├── navigation/        # Navigation setup
│   │   ├── components/        # Reusable components
│   │   ├── context/           # React Context
│   │   ├── services/          # API services
│   │   └── constants/         # Colors, themes
│   ├── App.tsx
│   ├── package.json
│   └── app.json
│
└── src/                        # Legacy web app (deprecated)
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User Endpoints

- `GET /api/users/progress` - Get user progress (protected)
- `PUT /api/users/progress` - Update user progress (protected)

### Goals Endpoints

- `GET /api/goals` - Get all user goals (protected)
- `POST /api/goals` - Create new goal (protected)
- `PUT /api/goals/:id` - Update goal (protected)
- `DELETE /api/goals/:id` - Delete goal (protected)

### Quiz Endpoints

- `GET /api/quiz/results` - Get quiz results (protected)
- `POST /api/quiz/submit` - Submit quiz result (protected)

### Chat Endpoints

- `GET /api/chat/:sessionId` - Get chat messages (protected)
- `POST /api/chat` - Send message (protected)

### Education Endpoints

- `GET /api/education/faq` - Get FAQs
- `GET /api/education/myths` - Get myths
- `GET /api/education/videos` - Get videos

### Health Services Endpoints

- `GET /api/health-services` - Get health services and helplines

## Development

### Running Backend in Development

```bash
cd backend
npm run dev
```

### Running Mobile App

```bash
cd mobile
npm start
```

### Building for Production

#### Backend

```bash
cd backend
npm run build
npm start
```

#### Mobile App

```bash
cd mobile
eas build --platform ios
eas build --platform android
```

## Design System

### Colors

- **Primary (Teal):** #14B8A6 - Supportive, calming
- **Secondary (Coral):** #F43F5E - Friendly, approachable
- **Success:** #10B981
- **Warning:** #F59E0B
- **Info:** #3B82F6
- **Error:** #EF4444

### Typography

- **Primary Font:** System default (San Francisco/Roboto)
- **Heading Scale:** 28px, 24px, 20px, 18px, 16px
- **Body:** 16px, 14px, 12px

## Contributing

This project is part of the Young Scientist Kenya 2026 competition. Contributions should align with the educational mission and maintain age-appropriate content.

## License

MIT License - See LICENSE file for details

## Acknowledgments

- Young Scientist Kenya 2026
- Kiambu Township Junior School
- National Campaign to Prevent Teen and Unplanned Pregnancy
- United Nations Population Fund (UNFPA)

## Contact

For questions or support, please contact through Kiambu Township Junior School.

## Important Notes

- This app is designed for educational purposes
- Not intended for collecting PII or securing sensitive medical data
- All content is age-appropriate and factually accurate
- Emphasizes privacy, confidentiality, and accessibility
- Culturally sensitive to Kenyan context

---

**Project Status:** Active Development  
**Last Updated:** May 2026  
**Version:** 1.0.0
