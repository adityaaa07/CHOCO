import { db } from "../firebase-config";
import { updateDoc, doc } from "firebase/firestore";

const shuffule = async (image, title, id, channelName, songs, name, platform, uri = null) => {
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

  const randomIndex = Math.floor(Math.random() * (songs.length + 1));
  songs.splice(randomIndex, 0, newTrack);

  await updateDoc(
    doc(db, 'room', sessionStorage.getItem('roomCode')),
    { currentSong: [...songs] }
  ).catch(err => console.log(err));
};

export default shuffule;
