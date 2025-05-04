import React, { useContext, createContext, useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { db } from '../firebase-config';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [videoId, setVideoId] = useState('');
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [modal_backdrop1, setmodal_backdrop1] = useState(false);
  const [joineeSong, setJoineeSong] = useState('');
  const [pathName, setPathName] = useState('');
  const [videoIds, setVideoIds] = useState([]);
  const [notification, setNotification] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLeaving, setIsLeaving] = useState(false);
  const [onReady, setOnReady] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playedBy, setPlayedBy] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('spotify_token') || null);
  const seekBarRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);

  useEffect(() => {
    const getData = () => {
      const roomCode = sessionStorage.getItem('roomCode');
      if (roomCode) {
        const messagesQuery = query(
          collection(db, 'room', roomCode, 'messages'),
          orderBy('timestamp', 'asc')
        );
        onSnapshot(messagesQuery, (data) => {
          const messageData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setMessages(messageData);
          const unReadMsg = messageData.filter(
            (doc) => doc.status === 'unread' && doc.sender !== Cookies.get('name')
          );
          setNotification(unReadMsg.length);
        });

        const roomRef = doc(db, 'room', roomCode);
        onSnapshot(roomRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setVideoIds(Array.isArray(data.currentSong) ? data.currentSong : []);
            if (data.currentPlaying) {
              setCurrentPlaying(data.currentPlaying);
              setTitle(data.currentPlaying.title);
              setArtist(data.currentPlaying.channelName);
              setPlayedBy(data.currentPlaying.playedBy);
              setIsPlaying(data.isPlaying || false);
              setCurrentTime(data.currentTime || 0);
              // Duration is set by the player component
            }
          }
        });
      }
    };
    getData();
  }, []);

  return (
    <StateContext.Provider value={{
      videoId, setVideoId,
      modal_backdrop, setmodal_backdrop,
      modal_backdrop1, setmodal_backdrop1,
      joineeSong, setJoineeSong,
      pathName, setPathName,
      notification, setNotification,
      videoIds, setVideoIds,
      messages, setMessages,
      isLeaving, setIsLeaving,
      onReady, setOnReady,
      title, setTitle,
      artist, setArtist,
      currentPlaying, setCurrentPlaying,
      duration, setDuration,
      currentTime, setCurrentTime,
      isPlaying, setIsPlaying,
      isSeeking, setIsSeeking,
      seekBarRef,
      playedBy, setPlayedBy,
      token, setToken,
      currentTrack, setCurrentTrack,
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
/*
import React, { useContext, createContext, useState, useEffect, useRef } from "react";
import { collection, query, orderBy, onSnapshot, doc, addDoc, Timestamp, updateDoc } from 'firebase/firestore';
import Cookies from 'js-cookie';
import { db } from '../firebase-config';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [videoId, setVideoId] = useState('');
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [modal_backdrop1, setmodal_backdrop1] = useState(false);
  const [joineeSong, setJoineeSong] = useState('');
  const [pathName, setPathName] = useState('');
  const [videoIds, setVideoIds] = useState([]);
  const [notification, setNotification] = useState(0);
  const [messages, setMessages] = useState([]);
  const [isLeaving, setIsLeaving] = useState(false);
  const [onReady, setOnReady] = useState(null);
  const [title, setTitle] = useState('');
  const [artist, setArtist] = useState('');
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [playedBy, setPlayedBy] = useState('');
  const [token, setToken] = useState(sessionStorage.getItem('spotify_token') || null);
  const seekBarRef = useRef(null);

  useEffect(() => {
    const getData = () => {
      const roomCode = sessionStorage.getItem('roomCode');
      if (roomCode) {
        const messagesQuery = query(
          collection(db, 'room', roomCode, 'messages'),
          orderBy('timestamp', 'asc')
        );
        onSnapshot(messagesQuery, (data) => {
          const messageData = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
          setMessages(messageData);
          const unReadMsg = messageData.filter(
            (doc) => doc.status === 'unread' && doc.sender !== Cookies.get('name')
          );
          setNotification(unReadMsg.length);
        });

        // Subscribe to room data
        const roomRef = doc(db, 'room', roomCode);
        onSnapshot(roomRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setVideoIds(Array.isArray(data.currentSong) ? data.currentSong : []);
            if (data.currentPlaying) {
              setCurrentPlaying(data.currentPlaying);
              setTitle(data.currentPlaying.title);
              setArtist(data.currentPlaying.channelName);
              setPlayedBy(data.currentPlaying.playedBy);
            }
          }
        });
      }
    };
    getData();
  }, []);

  return (
    <StateContext.Provider value={{
      videoId, setVideoId,
      modal_backdrop, setmodal_backdrop,
      modal_backdrop1, setmodal_backdrop1,
      joineeSong, setJoineeSong,
      pathName, setPathName,
      notification, setNotification,
      videoIds, setVideoIds,
      messages, setMessages,
      isLeaving, setIsLeaving,
      onReady, setOnReady,
      title, setTitle,
      artist, setArtist,
      currentPlaying, setCurrentPlaying,
      duration, setDuration,
      currentTime, setCurrentTime,
      isSeeking, setIsSeeking,
      seekBarRef,
      playedBy, setPlayedBy,
      token, setToken,
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
*/
