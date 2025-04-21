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
    if (videoIds.length > 1) {
      const index = videoIds.findIndex(data => data.id === currentPlaying.id);
      const next = videoIds[index + 1] || videoIds[0];
      updateDoc(docRef, {
        currentSong: videoIds,
        currentPlaying: next,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now()
      }).catch(console.log);
    }
  };

  useEffect(() => {
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

        // Sync play/pause and time
        const { isPlaying, currentTime, lastUpdated } = data;
        if (playerRef.current && playerReady) {
          const player = playerRef.current;
          const now = Date.now();
          const expectedTime = currentTime + (isPlaying ? (now - lastUpdated) / 1000 : 0);

          player.getCurrentTime().then(time => {
            if (Math.abs(time - expectedTime) > 1.5) {
              player.seekTo(expectedTime, true);
            }
          });

          if (isPlaying) {
            player.playVideo();
          } else {
            player.pauseVideo();
          }
        }
      }
    });

    return () => unsub();
  }, [playerReady]);

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
        playerVars: {
          autoplay: 1,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          fs: 0,
        },
        events: {
          onReady: (event) => {
            const player = event.target;
            setOnReady(player);
            setDuration(player.getDuration());
            setPlayerReady(true);
            startInterval(player);
          },
          onStateChange: async (event) => {
            const player = playerRef.current;
            const state = event.data;

            if (state === window.YT.PlayerState.PLAYING) {
              startInterval(player);
              const currentTime = await player.getCurrentTime();
              updateDoc(docRef, {
                isPlaying: true,
                currentTime,
                lastUpdated: Date.now(),
              });
            } else if (state === window.YT.PlayerState.PAUSED) {
              clearInterval(intervalRef.current);
              const currentTime = await player.getCurrentTime();
              updateDoc(docRef, {
                isPlaying: false,
                currentTime,
                lastUpdated: Date.now(),
              });
            }

            if (state === window.YT.PlayerState.ENDED) {
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
    intervalRef.current = setInterval(async () => {
      const newCurrentTime = await player.getCurrentTime();
      setCurrentTime(prev => (Math.abs(newCurrentTime - prev) > 1 ? newCurrentTime : prev));
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

/*import React, { useState, useEffect, useRef } from 'react';
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

export default YouTubeVideo; */
