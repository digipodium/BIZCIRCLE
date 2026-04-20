require('dotenv').config();
const { connectDB } = require('./connection');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const UserRouter = require('./routers/UserRouter');
const GroupRouter = require('./routers/GroupRouter');
const MessageRouter = require('./routers/MessageRouter');
const ActivityRouter = require('./routers/ActivityRouter');
const circleRouter = require('./routers/CircleRouter');
const ReferralRouter = require('./routers/ReferralRouter');
const NotificationRouter = require('./routers/NotificationRouter');


const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// Routes
app.use('/user', UserRouter);
app.use('/group', GroupRouter);
app.use('/api/messages', MessageRouter);
app.use('/api', ActivityRouter); // Events, Polls, legacy Notifications
app.use('/api/circles', circleRouter);
app.use('/api/referrals', ReferralRouter);
app.use('/api/notifications', NotificationRouter); // Full notification module

// Health check endpoint
app.get('/api/health', (req, res) => {
    const { mongoose } = require('./connection');
    const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
    res.json({
        status: 'ok',
        database: dbStatus,
        timestamp: new Date().toISOString()
    });
});

// Expose io so controllers can call io.to(...).emit(...)
app.set('io', io);

// Socket.io integration
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_group', (groupId) => {
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on('join_user', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`Socket ${socket.id} joined personal room user_${userId}`);
    });

    socket.on('send_message', async (data) => {
        try {
            const MessageModel = require('./models/messageModel');
            const newMessage = await MessageModel.create(data);
            const populatedMessage = await newMessage.populate('sender', 'name email');
            io.to(data.group).emit('receive_message', populatedMessage);
        } catch (err) {
            console.error('Message save error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start server only AFTER DB is connected
const startServer = async () => {
    try {
        await connectDB();
        server.listen(port, () => {
            const mongoose = require('mongoose');
            console.log('Server running on port ' + port);
            console.log('Registered Models:', mongoose.modelNames());
        });
    } catch (err) {
        console.error('❌ Failed to connect to database:', err.message);
        process.exit(1);
    }
};

startServer();
