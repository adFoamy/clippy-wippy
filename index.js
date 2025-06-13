const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store the current text
let currentText = '';

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // When a client requests the current text
    socket.on('getText', () => {
        socket.emit('text', currentText);
    });

    // When a client updates the text
    socket.on('updateText', (text) => {
        currentText = text;
        // Broadcast the updated text to all clients except the sender
        socket.broadcast.emit('text', text);
    });

    // When a client disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('To access from other devices on the same network, use your local IP address');
});
