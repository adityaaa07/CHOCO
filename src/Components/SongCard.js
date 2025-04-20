import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../Context/ContextProvider';
import { db } from '../firebase-config';
import { doc, updateDoc } from 'firebase/firestore';
import Icon from '@mdi/react';
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
  isSpotify = false, // Default to false for YouTube tracks
  uri // Optional for Spotify
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
  const { setVideoId, videoIds, currentPlaying } = useStateContext();
  const nav = useNavigate();

  const name = Cookies.get('name');

  const handlePlay = async () => {
    if (isSpotify) return; // No autoplay for Spotify for now

    const song = { title, id, image, channelName, playedBy: name };
    const roomRef = doc(db, 'room', sessionStorage.getItem('roomCode'));

    if (videoIds) {
      await updateDoc(roomRef, {
        currentSong: [song, ...videoIds],
        currentPlaying: song
      }).catch(console.error);
    } else {
      await updateDoc(roomRef, {
        currentSong: [song],
        currentPlaying: song
      }).catch(console.error);
    }
  };

  const handleAdd = (type) => {
    if (type === 'queue') {
      addToQueue(image, title, id, channelName, videoIds, name);
      setToastMsg('Added to Queue');
    } else if (type === 'next') {
      playNext(image, title, id, channelName, videoIds, currentPlaying, name);
      setToastMsg('Added to Play Next');
    } else if (type === 'repeat') {
      addToQueue(image, title, id, channelName, videoIds, name); // Or a separate repeat handler
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
      <p className="w-2/3" onClick={handlePlay}>{title}</p>

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

/*import React, {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import { useStateContext } from '../Context/ContextProvider'
import { db } from '../firebase-config'
import {  doc, updateDoc } from 'firebase/firestore'
import Icon from '@mdi/react'
import { HiOutlineQueueList, HiOutlineHeart } from "react-icons/hi2";
import { IoEllipsisVertical, IoPlay, IoRepeatOutline, IoShuffleOutline,IoPlaySkipForwardOutline } from 'react-icons/io5'
import {Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap'
import addToQueue from '../Functions/addToQueue'
import shuffule from '../Functions/shuffle'
import playNext from '../Functions/playNext'
import Cookies from 'js-cookie'
const SongCard = ({image,title,id,channelName,setToastDisplay,setToastMsg}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen((prevState) => !prevState);
    const {setVideoId,videoIds,currentPlaying}=useStateContext()
    const nav=useNavigate()
   
 const handlePlay=async()=>{
  if(videoIds){
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[{title,id,image,channelName,playedBy:Cookies.get('name')},...videoIds],currentPlaying:{title,id,image,channelName,playedBy:Cookies.get('name')}}).catch(err=>console.log(err))
  }else{
    await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[{title,id,image,channelName,playedBy:Cookies.get('name')}],currentPlaying:{title,id,image,channelName,playedBy:Cookies.get('name')}}).catch(err=>console.log(err))
  }
 }
  return (

<div  className='flex flex-row m-3 justify-center items-center gap-2 text-white cursor-pointer' >
  <img src={image} className='rounded-lg h-16 w-16' onClick={()=>handlePlay()} />
  <p className='w-2/3' onClick={()=>handlePlay()}>{title}</p>
  <Dropdown isOpen={dropdownOpen} toggle={toggle} direction={'down'}>
<DropdownToggle className='btn' tag={'button'} >
<IoEllipsisVertical color='white' size={18} />
</DropdownToggle>
<DropdownMenu className='bg-dark  dropdown-menu-end border-dark   shadow-lg p-2'>
<DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
  playNext(image,title,id,channelName,videoIds,currentPlaying,Cookies.get('name'))
  setToastDisplay(true)
  setToastMsg('Added to Play next')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
<IoPlaySkipForwardOutline color='white' size={16} /> Play Next
</DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
    addToQueue(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Queue')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <HiOutlineQueueList color='white' size={16} />  Add to Queue
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
    addToQueue(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Repeat')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <IoRepeatOutline color='white' size={16} />  Repeat
  </DropdownItem>
  <DropdownItem className='d-flex gap-2 pt-3 pb-3 text-light text-xs dropwdown-item' onClick={()=>{
    shuffule(image,title,id,channelName,videoIds,Cookies.get('name'))
    setToastDisplay(true)
  setToastMsg('Added to Shuffle')
  setTimeout(()=>setToastDisplay(false),4000)
  }}>
  <IoShuffleOutline color='white' size={16} />  Shuffle
  </DropdownItem>
</DropdownMenu>
    </Dropdown>
</div>
   
  )
}

export default SongCard */
