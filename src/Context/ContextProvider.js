import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase-config';
import { onAuthStateChanged } from 'firebase/auth';

const StateContext = createContext();

export const ContextProvider = ({ children }) => {
  const [modal_backdrop, setmodal_backdrop] = useState(false);
  const [notification, setNotification] = useState(0);
  const [pathName, setPathName] = useState('/');
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState('');
  const [videoIds, setVideoIds] = useState([]);
  const [currentPlaying, setCurrentPlaying] = useState(null);
  const [loginSource, setLoginSource] = useState(localStorage.getItem('loginSource') || '');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPathName('/home');
        console.log('User authenticated:', user.uid);
      } else {
        setPathName('/');
        console.warn('No authenticated user');
      }
    }, (error) => {
      console.error('Auth state error:', error.message);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const spotifyToken = sessionStorage.getItem('spotify_token') || localStorage.getItem('spotify_access_token');
    if (spotifyToken && loginSource === 'spotify') {
      setToken(spotifyToken);
      console.log('Spotify token set:', spotifyToken);
    }
  }, [loginSource]);

  return (
    <StateContext.Provider
      value={{
        modal_backdrop,
        setmodal_backdrop,
        notification,
        setNotification,
        pathName,
        setPathName,
        messages,
        setMessages,
        token,
        setToken,
        videoIds,
        setVideoIds,
        currentPlaying,
        setCurrentPlaying,
        loginSource,
        setLoginSource,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
/*import React, { useContext, createContext, useState, useEffect, useRef } from "react";
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
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
-------------------------------------------------------------------------*/
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
