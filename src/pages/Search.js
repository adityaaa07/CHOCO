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

const Search = () => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastDisplay, setToastDisplay] = useState(false);
  const [data, setData] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const spotifyToken = sessionStorage.getItem('spotify_token');

    const youtubeOptions = {
      method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        maxResults: 20,
        q: input + ' songs',
        key: apiKey,
        type: 'video',
        videoCategoryId: '10',
      },
    };

    try {
      const [youtubeRes, spotifyRes] = await Promise.all([
        axios.request(youtubeOptions),
        spotifyToken
          ? axios.get('https://api.spotify.com/v1/search', {
              headers: {
                Authorization: `Bearer ${spotifyToken}`,
              },
              params: {
                q: input,
                type: 'track',
                limit: 20,
              },
            })
          : Promise.resolve({ data: { tracks: { items: [] } } }),
      ]);

      const ytTracks = youtubeRes.data.items.map((item) => ({
        image: item.snippet?.thumbnails?.medium?.url,
        title: item.snippet?.title,
        id: item.id?.videoId,
        channelName: item.snippet?.channelTitle,
        platform: 'youtube',
      }));

      const spTracks = spotifyRes.data.tracks.items.map((track) => ({
        image: track.album.images[0]?.url,
        title: track.name,
        id: track.id,
        uri: track.uri,
        channelName: track.artists.map((artist) => artist.name).join(', '),
        platform: 'spotify',
      }));

      setData([...ytTracks, ...spTracks]);
    } catch (error) {
      console.error('Search Error:', error);
      setToastMsg('Something went wrong while searching.');
      setToastDisplay(true);
    } finally {
      setIsLoading(false);
    }
  };

  const shimmerArr = Array.from({ length: 14 });

  return (
    /*<div className="flex h-screen bg-black text-white">*/
    <div className="flex flex-col min-h-screen bg-black text-white">
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
          <button
            type="submit"
            className="bg-white text-gray-700 px-4 py-2 rounded-md"
          >
            <Icon path={mdiMagnify} size={1} />
          </button>
        </form>

        {/* Content Area */}
        <div
          className="overflow-y-auto pr-2"
          style={{ height: 'calc(100vh - 150px)' }}
        >
          {!isLoading && data.length > 0 ? (
            data.map((obj, index) => (
              <SongCard
                key={index}
                image={obj.image}
                title={obj.title}
                id={obj.id}
                uri={obj.uri} // only for Spotify
                channelName={obj.channelName}
                isSpotify={obj.platform === 'spotify'}
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
              <h5 className="mt-7 font-semibold">
                Find your favorite tracks here
              </h5>
              <p className="text-sm text-center text-gray-300 mt-2">
                Listen to your favorite songs and artists with your loved ones
                together!
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
