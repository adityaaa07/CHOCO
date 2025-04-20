import React, { useEffect, useState } from 'react';

function extractTrackId(url, platform) {
  if (platform === 'spotify') {
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  }
  if (platform === 'youtube') {
    const match = url.match(/v=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  }
  return null;
}

const TrackQueue = ({ socket, roomCode }) => {
  const [trackUrl, setTrackUrl] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [platform, setPlatform] = useState('spotify');
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    socket.emit('get-queue', roomCode);
    socket.on('queue-updated', (updatedQueue) => {
      setQueue(updatedQueue);
    });

    return () => {
      socket.off('queue-updated');
    };
  }, [socket, roomCode]);

  const handleAddTrack = () => {
    if (!trackUrl || !trackTitle) return;

    const newTrack = {
      title: trackTitle,
      url: trackUrl,
      platform: platform,
    };

    socket.emit('add-track', { roomCode, track: newTrack });
    setTrackUrl('');
    setTrackTitle('');
  };

  return (
    <div>
      <h3>Add a Track</h3>
      <input
        type="text"
        placeholder="Track Title"
        value={trackTitle}
        onChange={(e) => setTrackTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Track URL"
        value={trackUrl}
        onChange={(e) => setTrackUrl(e.target.value)}
      />
      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        <option value="spotify">Spotify</option>
        <option value="youtube">YouTube</option>
      </select>
      <button onClick={handleAddTrack}>Add to Queue</button>

      <h3>Queue</h3>
      {queue.length === 0 && <p>No tracks in queue yet.</p>}
      <ul>
        {queue.map((track, index) => {
          const trackId = extractTrackId(track.url, track.platform);
          return (
            <li key={index} style={{ marginBottom: '20px' }}>
              <strong>{track.title}</strong> ({track.platform})
              {track.platform === 'spotify' && trackId && (
                <iframe
                  src={`https://open.spotify.com/embed/track/${trackId}`}
                  width="100%"
                  height="80"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              )}
              {track.platform === 'youtube' && trackId && (
                <iframe
                  width="100%"
                  height="80"
                  src={`https://www.youtube.com/embed/${trackId}`}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default TrackQueue;

