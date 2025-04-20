import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const playNext = async (image, title, id, channelName, songs, currentPlaying, name, platform, uri = null) => {
  if (songs) {
    const newTrack = {
      image,
      title,
      id,
      channelName,
      platform,
      playedBy: name,
    };

    if (platform === 'spotify' && uri) {
      newTrack.uri = uri;
    }

    const index = songs.findIndex(data => data.id === currentPlaying.id);
    songs.splice(index + 1, 0, newTrack);
    
    await updateDoc(
      doc(db, 'room', sessionStorage.getItem('roomCode')),
      { currentSong: [...songs] }
    ).catch(err => console.log(err));
  }
};

export default playNext;
