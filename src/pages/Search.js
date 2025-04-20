import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import Icon from '@mdi/react';
import { mdiMagnify } from '@mdi/js';
import axios from 'axios';
import SongCard from '../Components/SongCard';
import '../App.css';
import Shimmer from '../Components/Shimmer';
import Toast from '../Components/Toast';
import QueuePanel from '../Components/QueuePanel';
import { useStateContext } from '../Context/ContextProvider'; // for Spotify token

const Search = () => {
  const { spotifyToken } = useStateContext(); // grab Spotify token from context
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastDisplay, setToastDisplay] = useState(false);
  const [data, setData] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);

    const youtubeOptions = {
      method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        maxResults: 20,
        q: input + ' songs',
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
        type: 'video',
        videoCategoryId: '10',
      },
    };

    const youtubePromise = axios.request(youtubeOptions);

    const spotifyPromise = spotifyToken
      ? axios.get(
          `https://api.spotify.com/v1/search?q=${encodeURIComponent(input)}&type=track&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
          }
        )
      : Promise.resolve({ data: { tracks: { items: [] } } });

    try {
      const [youtubeRes, spotifyRes] = await Promise.all([youtubePromise, spotifyPromise]);

      const youtubeTracks = youtubeRes.data.items
        .filter((item) => item.id?.videoId)
        .map((item) => ({
          platform: 'youtube',
          id: item.id.videoId,
          title: item.snippet.title,
          image: item.snippet.thumbnails?.medium?.url,
          channelName: item.snippet.channelTitle,
        }));

      const spotifyTracks = spotifyRes.data.tracks.items.map((item) => ({
        platform: 'spotify',
        id: item.id,
        title: item.name,
        image: item.album.images[1]?.url || '',
        channelName: item.artists.map((artist) => artist.name).join(', '),
      }));

      setData([...spotifyTracks, ...youtubeTracks]);
    } catch (error) {
      console.error('Search Error:', error.response?.data || error.message);
      setToastMsg('Something went wrong while searching.');
      setToastDisplay(true);
    } finally {
      setIsLoading(false);
    }
  };

  const shimmerArr = Array.from({ length: 14 });

  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar / Queue Panel */}
      <div className="w-[300px] border-r border-zinc-700 overflow-y-auto">
        <QueuePanel />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden">
        {/* Search Heading */}
        <div className="text-2xl font-bold mb-4">Search</div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border px-3 py-2 rounded-md bg-white text-black placeholder-gray-400 outline-none"
            placeholder="Find your track..."
          />
          <button type="submit" className="bg-white text-gray-700 px-4 py-2 rounded-md">
            <Icon path={mdiMagnify} size={1} />
          </button>
        </form>

        {/* Content Area */}
        <div className="overflow-y-auto pr-2" style={{ height: 'calc(100vh - 150px)' }}>
          {!isLoading && data.length > 0 ? (
            data.map((track, index) => (
              <SongCard
                key={index}
                image={track.image}
                title={track.title}
                id={track.id}
                channelName={track.channelName}
                platform={track.platform}
                setToastDisplay={setToastDisplay}
                setToastMsg={setToastMsg}
              />
            ))
          ) : isLoading ? (
            shimmerArr.map((_, index) => <Shimmer key={index} />)
          ) : (
            <div className="flex flex-col justify-center items-center mt-14 text-slate-50">
              <img
                src={require('../assests/tape.png')}
                height={200}
                width={200}
                alt="cassette"
              />
              <h5 className="mt-7 font-semibold">Find your favorite tracks here</h5>
              <p className="text-sm text-center text-gray-300 mt-2">
                Listen to your favorite songs and artists with your loved ones together!
              </p>
            </div>
          )}

          {toastDisplay && (
            <div className="flex justify-center mt-4">
              <Toast message={toastMsg} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
