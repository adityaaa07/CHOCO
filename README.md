# Choco

## 🎵 Multi-User Speaker Control via Web Interface
Choco is a web-based application that allows multiple users to connect to a speaker and control audio playback in real time. Users can join a speaker session via QR code and collaboratively play, pause, and queue songs from various streaming platforms.

---
## 🚀 Features Implemented So Far
### **1️⃣ Backend** (Express + WebSockets)
- **Server Setup:** Express.js-based backend running on **port 5000**.
- **WebSocket Integration:** Implemented real-time communication using `socket.io`.
- **API Routes:**
  - `GET /` → Basic health check route.
- **Socket Events:**
  - `playAudio` → Broadcasts play command to all users.
  - `pauseAudio` → Broadcasts pause command to all users.
  - `queueSong` → Broadcasts the queued song URL to all users.

### **2️⃣ Frontend** (React + Vite + TypeScript)
- **Vite + TypeScript Setup** for fast frontend development.
- **Custom Hook (`useSocket.ts`)** to manage WebSocket connection.
- **Player UI (`Player.tsx`)**
  - Play / Pause buttons to control the speaker.
  - Input field to queue a song.
- **Join Speaker Page (`JoinSpeaker.tsx`)**
  - Retrieves `speakerId` from the URL.
  - Allows users to join an ongoing speaker session.

---
## 📌 Tech Stack
| Technology | Purpose |
|------------|---------|
| **Express.js** | Backend server |
| **Socket.IO** | WebSocket communication |
| **React.js** | Frontend UI framework |
| **Vite** | Fast development environment |
| **TypeScript** | Type safety and maintainability |
| **CORS** | Handling cross-origin requests |
| **dotenv** | Managing environment variables |
| **React Router** | Handling page navigation |

---
## 🛠️ Installation & Setup
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/choco.git
cd choco
```

### **2️⃣ Backend Setup**
```bash
cd choco-backend
npm install
npm start
```
_Backend runs on `http://localhost:5000`_

### **3️⃣ Frontend Setup**
```bash
cd choco-frontend
npm install
npm run dev
```
_Frontend runs on `http://localhost:5173`_

---






















                                
# CHOCO : How it really works ==>
Make 2 folders frontend and backend 
Install all the necessary libraries as follows :
Here’s a table of all the libraries imported so far in **Choco**, along with their usage:  

| **Library**        | **Imported In**       | **Purpose** |
|--------------------|----------------------|------------|
| **express**       | `server.js`          | Backend framework for handling API requests |
| **http**          | `server.js`          | Required to create an HTTP server instance |
| **socket.io**     | `server.js`          | Enables real-time WebSocket communication |
| **cors**          | `server.js`          | Allows cross-origin resource sharing (CORS) |
| **dotenv**        | `server.js`          | Loads environment variables from `.env` file |
| **react**         | All React components | Required for creating React-based frontend |
| **react-router-dom** | `JoinSpeaker.tsx` | Handles URL-based routing in the frontend |
| **socket.io-client** | `useSocket.ts`     | Enables real-time connection from frontend to backend |
| **useState**      | `useSocket.ts`, `Player.tsx` | Manages state variables in React |
| **useEffect**     | `useSocket.ts`       | Handles side effects in React components |

