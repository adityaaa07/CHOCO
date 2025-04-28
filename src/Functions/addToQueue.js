import { db } from "../firebase-config";
import { ref, push } from "firebase/database";

const addToQueue = async (roomCode, songData, platform) => {
  try {
    const queueRef = ref(db, `rooms/${roomCode}/queue`);

    let formattedData = {};

    if (platform === "youtube") {
      formattedData = {
        id: songData.videoId,
        title: songData.title,
        artist: songData.channelTitle || "Unknown Artist",
        thumbnail: songData.thumbnail,
        platform: "youtube",
        uri: `https://www.youtube.com/watch?v=${songData.videoId}`,
      };
    } 
    else if (platform === "spotify") {
      formattedData = {
        id: songData.id,
        title: songData.name,
        artist: songData.artists.map(artist => artist.name).join(", "),
        thumbnail: songData.album?.images[0]?.url || "", // Highest quality image
        platform: "spotify",
        uri: songData.uri, // Spotify URI
      };
    }

    await push(queueRef, formattedData);
    console.log("Song added to queue:", formattedData);

  } catch (error) {
    console.error("Error adding song to queue:", error);
  }
};
 export default addToQueue;
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
