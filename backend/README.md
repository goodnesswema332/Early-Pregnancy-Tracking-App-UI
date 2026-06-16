# Early Pregnancy Prevention App - Backend API

Backend API for the Young Scientist Kenya 2026 educational project.

## Setup

1. Install dependencies:
```bash
cd backend
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
- Set `MONGODB_URI` to your MongoDB connection string
- Set `JWT_SECRET` to a secure random string
- Set `FRONTEND_URL` to your mobile app URL

4. Run the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### User Progress
- `GET /api/users/progress` - Get user progress
- `PUT /api/users/progress` - Update user progress

### Goals
- `GET /api/goals` - Get all user goals
- `POST /api/goals` - Create new goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Quiz
- `GET /api/quiz/results` - Get quiz results
- `POST /api/quiz/submit` - Submit quiz result

### Chat
- `GET /api/chat/:sessionId` - Get chat messages
- `POST /api/chat` - Send message

### Education
- `GET /api/education/faq` - Get FAQs
- `GET /api/education/myths` - Get myths
- `GET /api/education/videos` - Get videos

### Health Services
- `GET /api/health-services` - Get health services and helplines

## Production Build

```bash
npm run build
npm start
```
