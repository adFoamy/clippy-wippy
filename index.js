const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Store the current text
let currentText = '';

// Store information about uploaded files
let uploadedFiles = [];

// Function to get the list of files from the uploads directory
function getUploadedFiles() {
    try {
        if (!fs.existsSync(uploadsDir)) {
            return [];
        }

        const files = fs.readdirSync(uploadsDir);
        return files.map(file => {
            const stats = fs.statSync(path.join(uploadsDir, file));
            return {
                name: file,
                originalName: file.substring(file.indexOf('-') + 1),
                size: stats.size,
                date: stats.mtime
            };
        });
    } catch (error) {
        console.error('Error reading uploads directory:', error);
        return [];
    }
}

// Initialize uploaded files list
uploadedFiles = getUploadedFiles();

// File upload route
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    const fileInfo = {
        name: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size,
        date: new Date()
    };

    uploadedFiles.push(fileInfo);

    // Notify all clients about the new file
    io.emit('fileUploaded', fileInfo);
    io.emit('fileList', uploadedFiles);

    res.status(200).send(fileInfo);
});

// File download route (optional, as files are already accessible via static middleware)
app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('File not found');
    }

    // Get the original file name from the stored filename
    const originalName = filename.substring(filename.indexOf('-') + 1);

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${originalName}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send the file
    res.sendFile(filePath);
});

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // When a client requests the current text
    socket.on('getText', () => {
        socket.emit('text', currentText);
    });

    // Send the list of files to the new client
    socket.emit('fileList', uploadedFiles);

    // When a client updates the text
    socket.on('updateText', (text) => {
        currentText = text;
        // Broadcast the updated text to all clients except the sender
        socket.broadcast.emit('text', text);
    });

    // When a client requests the file list
    socket.on('getFileList', () => {
        socket.emit('fileList', uploadedFiles);
    });

    // When a client disconnects
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });

    socket.on('deleteFile', (fileName) => {
        const filePath = path.join(uploadsDir, fileName);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            uploadedFiles = uploadedFiles.filter(file => file.name !== fileName);
            io.emit('fileList', uploadedFiles);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('To access from other devices on the same network, use your local IP address');
});
