# clippy-wippy

A simple browser-based text sharing application that allows users to share text across different devices on the same network.

## Features

- Multi-line text box for typing or pasting text
- Real-time text synchronization across all connected devices
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

1. The server maintains the current state of the text
2. When a user connects, they receive the current text
3. When any user updates the text, the changes are broadcast to all other connected users
4. All connected users see the same text in real-time

## Technologies Used

- Express.js - Web server framework
- Socket.IO - Real-time bidirectional event-based communication
- HTML/CSS/JavaScript - Frontend interface