require('dotenv').config();
require('./connection');
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const UserRouter = require('./routers/UserRouter');
const GroupRouter = require('./routers/GroupRouter');
const MessageRouter = require('./routers/MessageRouter');
const ActivityRouter = require('./routers/ActivityRouter');
const circleRouter = require("./routers/CircleRouter");
const ReferralRouter = require("./routers/ReferralRouter");
const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('public/uploads'));

// Routes
app.use('/user', UserRouter);
app.use('/group', GroupRouter);
app.use('/api/messages', MessageRouter);
app.use('/api', ActivityRouter); // Events, Polls, Notifications
app.use("/api/circles", circleRouter);
app.use("/api/referrals", ReferralRouter);
// Socket.io integration
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join_group', (groupId) => {
        socket.join(groupId);
        console.log(`Socket ${socket.id} joined group ${groupId}`);
    });

    socket.on('send_message', async (data) => {
        // data: { group, sender, content, fileUrl }
        try {
            const MessageModel = require('./models/messageModel');
            const newMessage = await MessageModel.create(data);
            const populatedMessage = await newMessage.populate('sender', 'name email');
            
            // Broadcast to group
            io.to(data.group).emit('receive_message', populatedMessage);
        } catch (err) {
            console.error('Message save error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(port, () => {
    console.log('Server running on port ' + port);
});