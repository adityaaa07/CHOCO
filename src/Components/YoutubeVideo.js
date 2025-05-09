
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useStateContext } from '../Context/ContextProvider';
import { HiMusicalNote } from 'react-icons/hi2';

const YouTubeVideo = ({ videoIds }) => {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [id, setId] = useState('');
  const [playerReady, setPlayerReady] = useState(false);

  const {
    setOnReady,
    setTitle,
    setArtist,
    setVideoIds,
    currentPlaying,
    setCurrentPlaying,
    setDuration,
    setCurrentTime,
    setPlayedBy,
  } = useStateContext();

  const roomCode = sessionStorage.getItem('roomCode');
  const docRef = doc(db, 'room', roomCode);

  const onVideoEnd = () => {
    if (videoIds?.length > 1) {
      const index = videoIds.findIndex(data => data.id === currentPlaying?.id);
      const next = videoIds[index + 1] || videoIds[0];
      updateDoc(docRef, {
        currentSong: videoIds,
        currentPlaying: next,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      }).catch(console.error);
    }
  };

  useEffect(() => {
    if (!roomCode) return;

    const unsub = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVideoIds(Array.isArray(data.currentSong) ? data.currentSong : []);

        if (data.currentPlaying) {
          setCurrentPlaying(data.currentPlaying);
          setId(data.currentPlaying.id);
          setTitle(data.currentPlaying.title);
          setArtist(data.currentPlaying.channelName);
          setPlayedBy(data.currentPlaying.playedBy);
        }

        const { isPlaying, currentTime, lastUpdated } = data;
        const player = playerRef.current;
        if (player && playerReady) {
          const now = Date.now();
          const expectedTime = currentTime + (isPlaying ? (now - lastUpdated) / 1000 : 0);
          const playerTime = await player.getCurrentTime();

          if (Math.abs(playerTime - expectedTime) > 1.5) {
            player.seekTo(expectedTime, true);
          }

          const playerState = player.getPlayerState();
          if (isPlaying && playerState !== window.YT?.PlayerState.PLAYING) {
            player.playVideo();
          } else if (!isPlaying && playerState === window.YT?.PlayerState.PLAYING) {
            player.pauseVideo();
          }
        }
      }
    });

    return () => unsub();
  }, [playerReady, roomCode]);

  useEffect(() => {
    if (!id) return;

    const loadYouTubeAPI = () => {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        document.body.appendChild(tag);
      } else {
        createPlayer();
      }

      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
    };

    const createPlayer = () => {
      if (playerRef.current) {
        playerRef.current.destroy?.();
      }

      playerRef.current = new window.YT.Player('player-container', {
        videoId: id,
        host: 'https://www.youtube.com', // Ensure correct origin
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
          origin: window.location.origin, // Set correct origin
        },
        events: {
          onReady: (event) => {
            setOnReady(event.target);
            setDuration(event.target.getDuration());
            setPlayerReady(true);
            startInterval(event.target);
          },
          onStateChange: async (event) => {
            const player = playerRef.current;
            const state = event.data;

            if (state === window.YT?.PlayerState.PLAYING) {
              const time = await player.getCurrentTime();
              updateDoc(docRef, {
                isPlaying: true,
                currentTime: time,
                lastUpdated: Date.now(),
              });
              startInterval(player);
            } else if (state === window.YT?.PlayerState.PAUSED) {
              const time = await player.getCurrentTime();
              updateDoc(docRef, {
                isPlaying: false,
                currentTime: time,
                lastUpdated: Date.now(),
              });
              clearInterval(intervalRef.current);
            }

            if (state === window.YT?.PlayerState.ENDED) {
              onVideoEnd();
            }
          },
          onError: (error) => {
            console.error('YouTube Player Error:', error);
          },
        },
      });
    };

    loadYouTubeAPI();

    return () => {
      clearInterval(intervalRef.current);
      playerRef.current?.destroy?.();
    };
  }, [id]);

  const startInterval = (player) => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const newCurrentTime = player.getCurrentTime();
      setCurrentTime(prev => {
        if (Math.abs(newCurrentTime - prev) > 1) return newCurrentTime;
        return prev;
      });
    }, 500);
  };

  return (
    <div>
      {id ? (
        <div className="w-full h-[200px]">
          <div id="player-container" className="w-full h-[200px]" />
        </div>
      ) : (
        <div className="h-60 w-60 mt-3 bg-zinc-800 rounded-lg flex justify-center items-center">
          <HiMusicalNote color="black" size={86} />
        </div>
      )}
    </div>
  );
};

export default YouTubeVideo;
