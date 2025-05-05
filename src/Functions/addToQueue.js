
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
  // Validate inputs
  if (!image || !title || !id || !channelName || !name || (platform === 'spotify' && !uri)) {
    console.error('Invalid track data for queue:', { image, title, id, channelName, name, uri });
    return;
  }

  const track = {
    image,
    title,
    id,
    channelName,
    platform,
    playedBy: name,
  };

  if (platform === 'spotify' && uri) {
    track.uri = uri;
  }

  const updatedSongs = Array.isArray(songs) ? [...songs] : [];
  updatedSongs.push(track);

  const roomCode = sessionStorage.getItem('roomCode');
  if (!roomCode) {
    console.error('No room code found');
    return;
  }

  const roomRef = doc(db, 'room', roomCode);

  try {
    await updateDoc(roomRef, {
      currentSong: updatedSongs,
    });
    console.log(`${platform} track added to queue: ${title}`);
  } catch (err) {
    console.error("Error updating queue in Firebase:", err);
  }
};

export default addToQueue;
