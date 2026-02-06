const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth.routes');
const movieRoutes = require('./routes/movie.routes');
const showRoutes = require('./routes/show.routes');
const bookingRoutes = require('./routes/booking.routes');
const infraRoutes = require('./routes/infra.routes');

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/infra', infraRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });

    // Seat locking events
    socket.on('join_show', (showId) => {
        socket.join(showId);
        console.log(`User ${socket.id} joined show ${showId}`);
    });

    socket.on('select_seat', ({ showId, seats }) => {
        // Broadcast to others in the room
        socket.broadcast.to(showId).emit('seat_locked', seats);
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
