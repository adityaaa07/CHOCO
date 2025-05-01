
// src/pages/Homepage.js
import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Cookies from 'js-cookie';
import YouTubeVideo from '../Components/YoutubeVideo';
import { useStateContext } from '../Context/ContextProvider';
import { db, auth } from '../firebase-config';
import CreateRoom from '../Components/CreateRoom';
import JoinRoom from '../Components/JoinRoom';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from 'firebase/firestore';
import LeaveRoom from '../Components/LeaveRoom';
import { IoBookmarksOutline } from 'react-icons/io5';

const Homepage = () => {
  const nav = useNavigate();
  const [currentSong, setCurrentSong] = useState([]);
  const {
    setVideoIds,
    setIsLeaving,
    isLeaving,
    playedBy,
    pathName,
  } = useStateContext();
  const [roomMate, setRoomMate] = useState([]);
  const [admin, setAdmin] = useState('');

  // Determine login source on mount
  useEffect(() => {
    // If we have a Spotify token, it's a Spotify login
    if (
      sessionStorage.getItem('spotify_token') ||
      localStorage.getItem('spotify_access_token')
    ) {
      localStorage.setItem('loginSource', 'spotify');
    } else {
      // Otherwise assume Google (Firebase) login
      localStorage.setItem('loginSource', 'google');
    }
  }, []);

  const handleLeaveRoom = async () => {
    if (roomMate.length > 0) {
      const idx = roomMate.indexOf(Cookies.get('name'));
      if (idx > -1) roomMate.splice(idx, 1);
      await updateDoc(
        doc(db, 'room', sessionStorage.getItem('roomCode')),
        { members: roomMate }
      );
    }
    setCurrentSong([]);
    sessionStorage.removeItem('roomCode');
    setIsLeaving(!isLeaving);
  };

  // Subscribe to room data
  useEffect(() => {
    const roomCode = sessionStorage.getItem('roomCode');
    let unsub;
    if (roomCode) {
      const q = query(
        collection(db, 'room'),
        where('roomCode', '==', roomCode)
      );
      unsub = onSnapshot(q, (snap) => {
        const docs = snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));
        setCurrentSong(docs);
        setVideoIds(docs[0]?.currentSong || []);
        setRoomMate(docs[0]?.members || []);
        setAdmin(docs[0]?.roomAdmin || '');
      });
    }
    return () => unsub && unsub();
  }, [sessionStorage.getItem('roomCode')]);

  return (
    <>
      <Sidebar />
      <div
        className="flex flex-wrap justify-center gap-2 w-screen bg-black"
        id="top"
      >
        <CreateRoom />
        <JoinRoom />
        <LeaveRoom handleLeaveRoom={handleLeaveRoom} />

        <div className="m-3 mb-5 rounded-lg w-full max-w-md">
          {Cookies.get('name') &&
            !sessionStorage.getItem('roomCode') &&
            pathName.includes('home') && (
              <div className="text-white mt-3 text-lg ml-3 flex items-center">
                <b>
                  Welcome{' '}
                  {Cookies.get('name').split(' ')[0] ||
                    Cookies.get('name')}
                </b>
              </div>
            )}

          {sessionStorage.getItem('roomCode') &&
            currentSong.length > 0 && (
              <div className="flex items-center justify-center flex-col">
                {admin && (
                  <p className="text-sm text-slate-50 mt-2">
                    Created by {admin.split(' ')[0] || admin}
                  </p>
                )}
                <button
                  className="mx-auto text-sm text-white flex items-center gap-2"
                  onClick={() => setIsLeaving(true)}
                >
                  <IoBookmarksOutline color="white" size={16} />
                  {sessionStorage.getItem('roomCode')}
                </button>
                {playedBy && (
                  <p className="text-sm text-slate-50 mt-2">
                    Played by {playedBy.split(' ')[0] || playedBy}
                  </p>
                )}
                <YouTubeVideo
                  videoIds={currentSong[0]?.currentSong || []}
                />
              </div>
            )}
        </div>
      </div>
    </>
  );
};

export default Homepage;
