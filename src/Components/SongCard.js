
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
  const { videoIds, currentPlaying } = useStateContext();
  const nav = useNavigate();
  const name = Cookies.get('name');

  const handlePlay = async () => {
    if (isSpotify) {
      const token = sessionStorage.getItem('spotify_token');
      if (!token) {
        alert("Spotify token missing. Please re-authenticate.");
        return;
      }

      // Dynamically mount SpotifyPlayer component for playback
      const playerElement = document.createElement('div');
      document.body.appendChild(playerElement);

      const mountSpotifyPlayer = () => {
        import('react-dom').then(ReactDOM =>
          import('./SpotifyPlayer').then(module => {
            const SpotifyPlayer = module.default;
            ReactDOM.render(<SpotifyPlayer token={token} uri={uri} />, playerElement);
          })
        );
      };

      mountSpotifyPlayer();
      return;
    }

    // YouTube song logic
    const song = { title, id, image, channelName, playedBy: name, platform: 'youtube' };
    const roomRef = doc(db, 'room', sessionStorage.getItem('roomCode'));
    const updatedList = videoIds ? [song, ...videoIds] : [song];

    await updateDoc(roomRef, {
      currentSong: updatedList,
      currentPlaying: song,
      isPlaying: true,
      currentTime: 0,
      lastUpdated: Date.now()
    }).catch(console.error);
  };

  const handleAdd = (type) => {
    const platform = isSpotify ? 'spotify' : 'youtube';
    if (type === 'queue') {
      addToQueue(image, title, id, channelName, platform, videoIds, name, uri);
      setToastMsg('Added to Queue');
    } else if (type === 'next') {
      playNext(image, title, id, channelName, videoIds, currentPlaying, name);
      setToastMsg('Added to Play Next');
    } else if (type === 'repeat') {
      addToQueue(image, title, id, channelName, platform, videoIds, name, uri);
      setToastMsg('Added to Repeat');
    } else if (type === 'shuffle') {
      shuffule(image, title, id, channelName, videoIds, name);
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
        {title} {isSpotify && <span className="text-green-400 text-xs">(Spotify)</span>}
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
