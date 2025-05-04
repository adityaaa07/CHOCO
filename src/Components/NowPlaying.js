// src/Components/NowPlaying.js
import React from 'react';
import { useStateContext } from '../Context/ContextProvider';
import YouTubeVideo from './YoutubeVideo';
import SpotifyPlayer from './SpotifyPlayer';

const NowPlaying = () => {
  const { currentTrack } = useStateContext();

  if (!currentTrack) {
    return null; // No song currently playing
  }

  return (
    <div className="mb-4">
      {currentTrack.type === 'youtube' && (
        <YouTubeVideo videoIds={[{ videoId: currentTrack.videoId }]} />
      )}

      {currentTrack.type === 'spotify' && (
        <SpotifyPlayer
          token={sessionStorage.getItem('spotify_token')}
          uri={currentTrack.uri}
          image={currentTrack.image}
          title={currentTrack.title}
          channelName={currentTrack.channelName}
        />
      )}
    </div>
  );
};

export default NowPlaying;
