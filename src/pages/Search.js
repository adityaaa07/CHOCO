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

    const options = {
      method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        maxResults: 20,
        q: input + ' songs',
        key: apiKey,
        type: 'video',
        videoCategoryId: '10', // Optional: Music category
      },
    };

    try {
      const response = await axios.request(options);
      setData(response.data.items);
    } catch (error) {
      console.error('YouTube API Error:', error.response?.data || error.message);
      setToastMsg('Something went wrong while fetching videos.');
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
        <div className="text-2xl font-bold mb-4">
          Search
        </div>
  
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
        <div className="overflow-y-auto pr-2" style={{ height: 'calc(100vh - 150px)' }}>
          {!isLoading && data.length > 0 ? (
            data.map((obj, index) =>
              obj.id?.videoId ? (
                <SongCard
                  key={index}
                  image={obj.snippet?.thumbnails?.medium?.url}
                  title={obj.snippet?.title}
                  id={obj.id.videoId}
                  channelName={obj.snippet?.channelTitle}
                  setToastDisplay={setToastDisplay}
                  setToastMsg={setToastMsg}
                />
              ) : null
            )
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
