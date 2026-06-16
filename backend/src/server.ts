import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { createServer } from 'http';
import { Server as IOServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User';
import ChatMessage from './models/ChatMessage';
import ChatSession from './models/ChatSession';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8081',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev')); // Logging

// Database connection
import connectDB from './config/database';

// create HTTP server and socket.io after DB connection
const start = async () => {
  await connectDB();

  // create http server for socket.io
  const server = createServer(app);
  const io = new IOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:8081',
      credentials: true,
    },
  });

  // handshake auth: accept token to map user
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token || (socket.handshake.headers?.authorization?.toString().startsWith('Bearer') ? socket.handshake.headers?.authorization.toString().split(' ')[1] : undefined);
      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as { id: string };
        const user = await User.findById(decoded.id).select('+password');
        if (user) {
          // attach user info to socket
          (socket as any).data = { user };
          if (['admin', 'super', 'agent'].includes(user.role)) {
            socket.join('admins');
          }
        }
      }
    } catch (e) {
      // ignore invalid token
    }
    next();
  });

  io.on('connection', (socket) => {
    console.log('Socket connected', socket.id);
    socket.on('joinSession', ({ sessionId }: { sessionId: string }) => {
      socket.join(`session:${sessionId}`);
    });
    socket.on('joinAdmins', () => socket.join('admins'));
    // handle sendMessage with ack callback
    socket.on('sendMessage', async (payload: any, callback: any) => {
      try {
        const { sessionId, message, sender } = payload || {};
        if (!sessionId || !message) return callback && callback({ success: false, error: 'Invalid payload' });

        let msg: any;
        if (sender === 'support' || sender === 'admin') {
          const user = (socket as any).data?.user;
          msg = await ChatMessage.create({ sessionId, message, sender: 'support', userId: user?._id });
          await ChatSession.findByIdAndUpdate(sessionId, { status: 'active', assignedTo: user?._id });
        } else {
          msg = await ChatMessage.create({ sessionId, message, sender: 'user' });
          await ChatSession.findByIdAndUpdate(sessionId, { status: 'waiting' });
        }

        io.to(`session:${sessionId}`).emit('message:created', msg);
        io.to('admins').emit('session:message', { sessionId, message: msg });

        return callback && callback({ success: true, data: msg });
      } catch (err: any) {
        console.error('Socket sendMessage error', err);
        return callback && callback({ success: false, error: err.message || 'Server error' });
      }
    });
    socket.on('disconnect', () => console.log('Socket disconnected', socket.id));
  });

  // make io available to routes via app
  app.set('io', io);

  // start listening
  server.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📱 Early Pregnancy Prevention API`);
    console.log(`🏥 Environment: ${process.env.NODE_ENV || 'development'}\n`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});

// Routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import educationRoutes from './routes/education';
import goalsRoutes from './routes/goals';
import quizRoutes from './routes/quiz';
import chatRoutes from './routes/chat';
import healthServicesRoutes from './routes/healthServices';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/health-services', healthServicesRoutes);

// Serve uploaded thumbnails and static assets
app.use('/uploads', express.static(path.join(__dirname, '..', '..', 'uploads')));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'Early Pregnancy Prevention API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;
