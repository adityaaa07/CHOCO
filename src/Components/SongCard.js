/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../Context/ContextProvider';
import { db } from '../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import { HiOutlineQueueList } from 'react-icons/hi2';
import {
  IoEllipsisVertical,
  IoPlaySkipForwardOutline,
  IoRepeatOutline,
  IoShuffleOutline
} from 'react-icons/io5';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import addToQueue from '../Functions/addToQueue';
import shuffule from '../Functions/shuffle';
import playNext from '../Functions/playNext';
import Cookies from 'js-cookie';

const SongCard = ({
  image,
  title,
  id,
  channelName,
  setToastDisplay,
  setToastMsg,
  isSpotify = false,
  uri
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prev => !prev);
  const { videoIds, currentPlaying, setCurrentPlaying, setVideoIds } = useStateContext();
  const nav = useNavigate();
  const name = Cookies.get('name');

  const stopSpotifyPlayer = () => {
    const spotifyPlayers = document.querySelectorAll('div[id^="spotify-player"]');
    spotifyPlayers.forEach(player => {
      player.remove();
      console.log("Spotify player stopped and removed.");
    });
  };

  const stopYouTubePlayer = () => {
    const youtubePlayers = document.querySelectorAll('div[id^="youtube-player"]');
    youtubePlayers.forEach(player => {
      player.remove();
      console.log("YouTube player stopped and removed.");
    });
  };

  const handlePlay = async () => {
    if (!name) {
      setToastMsg('Please log in to play tracks.');
      setToastDisplay(true);
      return;
    }

    const roomCode = sessionStorage.getItem('roomCode');
    if (!roomCode) {
      setToastMsg('Please join a room first!');
      setToastDisplay(true);
      return;
    }

    // Validate track properties
    if (!image || !title || !id || !channelName || (isSpotify && !uri)) {
      setToastMsg('Invalid track data.');
      setToastDisplay(true);
      console.error('Invalid track data:', { image, title, id, channelName, uri });
      return;
    }

    const track = {
      title,
      id,
      image,
      channelName,
      platform: isSpotify ? 'spotify' : 'youtube',
      playedBy: name,
      ...(isSpotify ? { uri } : {}),
    };

    // Stop the other platform's player
    if (isSpotify) {
      stopYouTubePlayer();
    } else {
      stopSpotifyPlayer();
    }

    // Update Firebase
    const roomRef = doc(db, 'room', roomCode);
    try {
      const updatedQueue = Array.isArray(videoIds) ? [...videoIds] : [];
      if (!updatedQueue.some(t => t.id === id)) {
        updatedQueue.push(track);
      }

      await updateDoc(roomRef, {
        currentSong: updatedQueue,
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      setVideoIds(updatedQueue);
      setCurrentPlaying(track);
    } catch (error) {
      console.error('Error updating Firebase:', error);
      setToastMsg('Failed to play track.');
      setToastDisplay(true);
      return;
    }

    if (isSpotify) {
      const token = sessionStorage.getItem('spotify_token');
      if (!token) {
        setToastMsg('Spotify token missing. Please re-authenticate.');
        setToastDisplay(true);
        return;
      }

      const playerElement = document.createElement('div');
      playerElement.id = `spotify-player-${id}`;
      document.body.appendChild(playerElement);

      import('react-dom').then(ReactDOM =>
        import('./SpotifyPlayer').then(module => {
          const SpotifyPlayer = module.default;
          ReactDOM.render(<SpotifyPlayer token={token} uri={uri} />, playerElement);
        })
      );
    }
  };

  const handleAdd = (type) => {
    if (!image || !title || !id || !channelName || (isSpotify && !uri)) {
      setToastMsg('Invalid track data.');
      setToastDisplay(true);
      return;
    }

    const platform = isSpotify ? 'spotify' : 'youtube';
    if (type === 'queue') {
      addToQueue(image, title, id, channelName, platform, videoIds, name, uri);
      setToastMsg('Added to Queue');
    } else if (type === 'next') {
      playNext(image, title, id, channelName, videoIds, currentPlaying, name, platform, uri);
      setToastMsg('Added to Play Next');
    } else if (type === 'repeat') {
      addToQueue(image, title, id, channelName, platform, videoIds, name, uri);
      setToastMsg('Added to Repeat');
    } else if (type === 'shuffle') {
      shuffule(image, title, id, channelName, videoIds, name, platform, uri);
      setToastMsg('Added to Shuffle');
    }
    setToastDisplay(true);
    setTimeout(() => setToastDisplay(false), 4000);
  };

  return (
    <div className="flex flex-row m-3 justify-center items-center gap-2 text-white cursor-pointer">
      <img
        src={image}
        className="rounded-lg h-16 w-16"
        onClick={handlePlay}
        alt={title}
      />
      <p className="w-2/3" onClick={handlePlay}>
        {title}
        {isSpotify && <span className="text-green-400 text-xs">(Spotify)</span>}
      </p>

      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle className="btn" tag="button">
          <IoEllipsisVertical color="white" size={18} />
        </DropdownToggle>
        <DropdownMenu className="bg-dark dropdown-menu-end border-dark shadow-lg p-2">
          <DropdownItem onClick={() => handleAdd('next')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <IoPlaySkipForwardOutline color="white" size={16} /> Play Next
          </DropdownItem>
          <DropdownItem onClick={() => handleAdd('queue')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <HiOutlineQueueList color="white" size={16} /> Add to Queue
          </DropdownItem>
          <DropdownItem onClick={() => handleAdd('repeat')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <IoRepeatOutline color="white" size={16} /> Repeat
          </DropdownItem>
          <DropdownItem onClick={() => handleAdd('shuffle')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <IoShuffleOutline color="white" size={16} /> Shuffle
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default SongCard;
*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../Context/ContextProvider';
import { db } from '../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import { HiOutlineQueueList } from 'react-icons/hi2';
import {
  IoEllipsisVertical,
  IoPlaySkipForwardOutline,
  IoRepeatOutline,
  IoShuffleOutline
} from 'react-icons/io5';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import addToQueue from '../Functions/addToQueue';
import shuffule from '../Functions/shuffle';
import playNext from '../Functions/playNext';
import Cookies from 'js-cookie';

const SongCard = ({
  image,
  title,
  id,
  channelName,
  setToastDisplay,
  setToastMsg,
  isSpotify = false,
  uri
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prev => !prev);
  const { videoIds, currentPlaying, setCurrentPlaying, setVideoIds, token } = useStateContext();
  const nav = useNavigate();
  const name = Cookies.get('name') || 'Guest';

  const stopSpotifyPlayer = () => {
    const spotifyPlayers = document.querySelectorAll('div[id^="spotify-player"]');
    spotifyPlayers.forEach(player => {
      player.remove();
      console.log("SongCard: Spotify player stopped and removed.");
    });
  };

  const stopYouTubePlayer = () => {
    const youtubePlayers = document.querySelectorAll('div[id^="youtube-player"]');
    youtubePlayers.forEach(player => {
      player.remove();
      console.log("SongCard: YouTube player stopped and removed.");
    });
  };

  const handlePlay = async () => {
    if (!image || !title || !id || !channelName || (isSpotify && !uri)) {
      setToastMsg('Invalid track data.');
      setToastDisplay(true);
      console.error('SongCard: Invalid track data:', { image, title, id, channelName, uri });
      console.log("Track being set as currentPlaying:", track);
      return;
    }

    const track = {
      title,
      id,
      image,
      channelName,
      platform: isSpotify ? 'spotify' : 'youtube',
      playedBy: name,
      ...(isSpotify ? { uri } : {}),
    };

    // Log token and state for debugging
    const sessionToken = sessionStorage.getItem('spotify_token');
    console.log('SongCard: Playing track:', track);
    console.log('SongCard: Token status:', { contextToken: token, sessionToken });

    // Stop all players
    stopYouTubePlayer();
    stopSpotifyPlayer();

    // Update Firebase
    const roomCode = sessionStorage.getItem('roomCode') || 'default';
    const roomRef = doc(db, 'room', roomCode);
    try {
      const updatedQueue = Array.isArray(videoIds) ? [...videoIds] : [];
      if (!updatedQueue.some(t => t.id === id)) {
        updatedQueue.push(track);
      }

      await updateDoc(roomRef, {
        currentSong: updatedQueue,
        currentPlaying: track,
        isPlaying: true,
        currentTime: 0,
        lastUpdated: Date.now(),
      });

      setVideoIds(updatedQueue);
      setCurrentPlaying(track);

      if (isSpotify && !token && !sessionToken) {
        console.warn('SongCard: No Spotify token found. Playback may fail.');
        setToastMsg('Spotify authentication needed. Please log in.');
        setToastDisplay(true);
      }
    } catch (error) {
      console.error('SongCard: Error updating Firebase:', error);
      setToastMsg('Failed to play track. Check your connection or try logging in again.');
      setToastDisplay(true);
    }
  };

  const handleAdd = (type) => {
    if (!image || !title || !id || !channelName || (isSpotify && !uri)) {
      setToastMsg('Invalid track data.');
      setToastDisplay(true);
      return;
    }

    const platform = isSpotify ? 'spotify' : 'youtube';
    try {
      if (type === 'queue') {
        addToQueue(image, title, id, channelName, platform, videoIds, name, uri);
        setToastMsg('Added to Queue');
      } else if (type === 'next') {
        playNext(image, title, id, channelName, videoIds, currentPlaying, name, platform, uri);
        setToastMsg('Added to Play Next');
      } else if (type === 'repeat') {
        addToQueue(image, title, id, channelName, platform, videoIds, name, uri);
        setToastMsg('Added to Repeat');
      } else if (type === 'shuffle') {
        shuffule(image, title, id, channelName, videoIds, name, platform, uri);
        setToastMsg('Added to Shuffle');
      }
      setToastDisplay(true);
      setTimeout(() => setToastDisplay(false), 4000);
    } catch (error) {
      console.error('SongCard: Error adding to queue:', error);
      setToastMsg('Failed to add track.');
      setToastDisplay(true);
    }
  };

  return (
    <div className="flex flex-row m-3 justify-center items-center gap-2 text-white cursor-pointer">
      <img
        src={image}
        className="rounded-lg h-16 w-16"
        onClick={handlePlay}
        alt={title}
      />
      <p className="w-2/3" onClick={handlePlay}>
        {title}
        {isSpotify && <span className="text-green-400 text-xs">(Spotify)</span>}
      </p>

      <Dropdown isOpen={dropdownOpen} toggle={toggle} direction="down">
        <DropdownToggle className="btn" tag="button">
          <IoEllipsisVertical color="white" size={18} />
        </DropdownToggle>
        <DropdownMenu className="bg-dark dropdown-menu-end border-dark shadow-lg p-2">
          <DropdownItem onClick={() => handleAdd('next')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <IoPlaySkipForwardOutline color="white" size={16} /> Play Next
          </DropdownItem>
          <DropdownItem onClick={() => handleAdd('queue')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <HiOutlineQueueList color="white" size={16} /> Add to Queue
          </DropdownItem>
          <DropdownItem onClick={() => handleAdd('repeat')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <IoRepeatOutline color="white" size={16} /> Repeat
          </DropdownItem>
          <DropdownItem onClick={() => handleAdd('shuffle')} className="d-flex gap-2 pt-3 pb-3 text-light text-xs">
            <IoShuffleOutline color="white" size={16} /> Shuffle
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default SongCard;
