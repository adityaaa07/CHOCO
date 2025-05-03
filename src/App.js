import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ContextProvider } from './Context/ContextProvider';
import SpotifyCallback from './pages/SpotifyCallback';
import Index from './pages';
import Search from './pages/Search';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Homepage from './pages/Homepage';
import Profile from './pages/Profile';
import Privacypolicy from './pages/Privacypolicy';
import Terms from './pages/Terms';
import Thirdparty from './pages/Thirdparty';
import JoinRoom from './Components/JoinRoom';
import QueuePanel from './Components/QueuePanel';
import styled from 'styled-components';
import { useStateContext } from './Context/ContextProvider';
import './App.css';
import './index.css';

// Define styled component for font
const StyledText = styled.div`
  font-family: "Poppins", sans-serif;
`;

function App() {
  const { pathName, setPathName } = useStateContext();

  useEffect(() => {
    const getPathName = () => {
      const currentPath = window.location.pathname;
      if (currentPath === '/') {
        setPathName('login');
      } else {
        setPathName(currentPath);
      }
    };
    getPathName();
  }, [setPathName]);

  return (
    <ContextProvider>
      <Router>
        <StyledText>
          <div className="min-h-screen bg-black text-white">
            {/* Player Container for Spotify and YouTube players */}
            <div id="player-container" className="w-full h-[200px] mb-4"></div>

            {/* Conditional Homepage rendering */}
            {pathName !== 'login' && (
              <div className="mx-auto">
                <Homepage />
              </div>
            )}

            {/* Routes */}
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/home" element={<Index />} />
              <Route path="/callback" element={<SpotifyCallback />} />
              <Route path="/search" element={<Search />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/privacy-policy" element={<Privacypolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/third-party" element={<Thirdparty />} />
              <Route path="/join-room" element={<JoinRoom />} />
            </Routes>

            {/* Persistent Components */}
            <QueuePanel />
            <JoinRoom />
          </div>
        </StyledText>
      </Router>
    </ContextProvider>
  );
}

export default App;
