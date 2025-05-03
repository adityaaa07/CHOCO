
/*import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const addToQueue=async(image,title,id,channelName,songs,name)=>{
    if(songs){
        songs.splice(songs.length,0,{image,title,id,channelName,playedBy:name})
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[...songs]}).catch(err=>console.log(err)) 
    }else {
        await updateDoc(doc(db,'room',sessionStorage.getItem('roomCode')),{currentSong:[{image,title,id,channelName,playedBy:name}],currentPlaying:{image,title,id,channelName,playedBy:name}}).catch(err=>console.log(err))
    }
    
}
export default addToQueue*/
import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const addToQueue = async (image, title, id, channelName, platform, songs, name, uri = null) => {
  const track = {
    image,
    title,
    id,
    channelName,
    platform, // 'spotify' or 'youtube'
    playedBy: name,
  };

  if (platform === 'spotify' && uri) {
    track.uri = uri;
  }

  // Initialize songs as an empty array if undefined or not an array
  const updatedSongs = Array.isArray(songs) ? [...songs] : [];

  // Add the new track to the queue
  updatedSongs.push(track);

  const roomRef = doc(db, 'room', sessionStorage.getItem('roomCode'));

  try {
    // Update Firebase with the updated queue
    await updateDoc(roomRef, {
      currentSong: updatedSongs,
    });
    console.log(`${platform} track added to queue: ${title}`);
  } catch (err) {
    console.error("Error updating queue in Firebase:", err);
  }
};

export default addToQueue;
/*
import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const addToQueue = async (image, title, id, channelName, platform, songs, name, uri = null) => {
  const track = {
    image,
    title,
    id,
    channelName,
    platform, // 'spotify' or 'youtube'
    playedBy: name,
  };

  if (platform === 'spotify' && uri) {
    track.uri = uri;
  }
  if(!Array.isArray(songs)){
      songs=[];
  }
  const roomRef = doc(db, 'room', sessionStorage.getItem('roomCode'));

  if (songs) {
    songs.push(track);
    await updateDoc(roomRef, { currentSong: [...songs] }).catch((err) => console.log(err));
  } else {
    await updateDoc(roomRef, {
      currentSong: [track],
      currentPlaying: track,
    }).catch((err) => console.log(err));
  }
};

export default addToQueue;
*/
