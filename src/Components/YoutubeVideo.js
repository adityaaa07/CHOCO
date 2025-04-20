import React, { useState, useEffect, useRef } from 'react';
import { db } from '../firebase-config';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useStateContext } from '../Context/ContextProvider';
import { HiMusicalNote } from 'react-icons/hi2';

const YouTubeVideo = ({ videoIds }) => {
  const playerRef = useRef(null);
  const intervalRef = useRef(null);
  const [id, setId] = useState('');

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

  const onVideoEnd = () => {
    if (videoIds.length > 1) {
      const index = videoIds.findIndex(data => data.id === currentPlaying.id);
      const next = videoIds[index + 1] || videoIds[0];
      updateDoc(doc(db, 'room', sessionStorage.getItem('roomCode')), {
        currentSong: videoIds,
        currentPlaying: next,
      }).catch(console.log);
    }
  };

  useEffect(() => {
    const roomCode = sessionStorage.getItem('roomCode');
    const docRef = doc(db, 'room', roomCode);

    const unsub = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setVideoIds(data.currentSong);
        if (data.currentPlaying) {
          setCurrentPlaying(data.currentPlaying);
          setId(data.currentPlaying.id);
          setTitle(data.currentPlaying.title);
          setArtist(data.currentPlaying.channelName);
          setPlayedBy(data.currentPlaying.playedBy);
        }
      }
    });

    return () => unsub();
  }, []);

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
        playerRef.current.destroy?.(); // destroy previous player if exists
      }

      playerRef.current = new window.YT.Player('player-container', {
        videoId: id,
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
        },
        events: {
          onReady: (event) => {
            setOnReady(event.target);
            setDuration(event.target.getDuration());
            startInterval(event.target);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startInterval(event.target);
            } else {
              clearInterval(intervalRef.current);
            }

            if (event.data === window.YT.PlayerState.ENDED) {
              onVideoEnd();
            }
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
      <>
        {/* Hidden YouTube player */}
        <div className="w-0 h-0 overflow-hidden">
          <div id="player" className="w-0 h-0" />
        </div>

        {/* Visible thumbnail */}
        <div className="h-60 w-60 mt-3 bg-zinc-800 rounded-lg flex justify-center items-center overflow-hidden">
          <img
            src={https://img.youtube.com/vi/${id}/hqdefault.jpg}
            alt="Video Thumbnail"
            className="object-cover h-full w-full rounded-lg"
          />
        </div>
      </>
    ) : (
      <div className="h-60 w-60 mt-3 bg-zinc-800 rounded-lg flex justify-center items-center">
        <HiMusicalNote color="black" size={86} />
      </div>
    )}
  </div>
);
};

export default YouTubeVideo;
