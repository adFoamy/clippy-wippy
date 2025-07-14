# clippy-wippy

A simple browser-based text sharing application that allows users to share text across different devices on the same network.

## Features

- Multi-line text box for typing or pasting text
- Real-time text synchronization across all connected devices
- File upload and download functionality
- Simple and responsive user interface
- Works on any device with a web browser

## Requirements

- Node.js (v12 or higher recommended)
- npm (comes with Node.js)

## Installation

1. Clone this repository or download the source code
2. Navigate to the project directory
3. Install dependencies:

```bash
npm install
```

## Running the Application

Start the server:

```bash
npm start
```

The application will be available at:
- `http://localhost:3000` (on the host machine)
- `http://<your-local-ip>:3000` (for other devices on the same network)

To find your local IP address:
- On Windows: Open Command Prompt and type `ipconfig`
- On macOS/Linux: Open Terminal and type `ifconfig` or `ip addr`

## How It Works

### Text Sharing
1. The server maintains the current state of the text
2. When a user connects, they receive the current text
3. When any user updates the text, the changes are broadcast to all other connected users
4. All connected users see the same text in real-time

### File Sharing
1. Files are uploaded through the "filey wiley" section
2. Uploaded files are stored on the server
3. When a file is uploaded, all connected clients are notified
4. All users can see and download the uploaded files
5. Files are listed with their original name, size, and upload date

## Technologies Used

- Express.js - Web server framework
- Socket.IO - Real-time bidirectional event-based communication
- HTML/CSS/JavaScript - Frontend interface
