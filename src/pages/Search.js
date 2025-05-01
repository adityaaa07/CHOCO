
// src/pages/Search.js
import React, { useState, useEffect } from 'react';
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

  // On mount, ensure Spotify token is picked up from redirect hash
  useEffect(() => {
    const existingToken =
      sessionStorage.getItem('spotify_token') ||
      localStorage.getItem('spotify_access_token');

    if (!existingToken && window.location.hash) {
      const hash = window.location.hash
        .substring(1)
        .split('&')
        .reduce((acc, pair) => {
          const [key, value] = pair.split('=');
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});

      if (hash.access_token) {
        sessionStorage.setItem('spotify_token', hash.access_token);
        localStorage.setItem('spotify_access_token', hash.access_token);
        window.location.hash = '';
      }
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
    const spotifyToken =
      sessionStorage.getItem('spotify_token') ||
      localStorage.getItem('spotify_access_token');
    const loginSource = localStorage.getItem('loginSource');

    // YouTube API options
    const youtubeOptions = {
      method: 'GET',
      url: 'https://www.googleapis.com/youtube/v3/search',
      params: {
        part: 'snippet',
        maxResults: 20,
        q: `${input} songs`,
        key: apiKey,
        type: 'video',
        videoCategoryId: '10',
      },
    };

    try {
      let youtubeRes = { data: { items: [] } };
      let spotifyRes = { data: { tracks: { items: [] } } };

      // fetch depending on loginSource
      if (loginSource === 'google') {
        youtubeRes = await axios.request(youtubeOptions);
      } else if (loginSource === 'spotify') {
        if (!spotifyToken) {
          setToastMsg('You need to log in to Spotify!');
          setToastDisplay(true);
          setIsLoading(false);
          return;
        }
        spotifyRes = await axios.get(
          'https://api.spotify.com/v1/search',
          {
            headers: {
              Authorization: `Bearer ${spotifyToken}`,
            },
            params: {
              q: input,
              type: 'track',
              limit: 20,
              market: 'US',
            },
          }
        );
      }

      // map YouTube
      const ytTracks = youtubeRes.data.items.map((item) => ({
        image: item.snippet?.thumbnails?.medium?.url,
        title: item.snippet?.title,
        id: item.id?.videoId,
        channelName: item.snippet?.channelTitle,
        platform: 'youtube',
      }));

      // map Spotify
      const spTracks =
        spotifyRes.data.tracks?.items?.map((track) => ({
          image: track.album?.images?.[0]?.url || '',
          title: track.name,
          id: track.id,
          uri: track.uri,
          channelName: track.artists
            .map((artist) => artist.name)
            .join(', '),
          platform: 'spotify',
        })) || [];

      // set only the appropriate data
      setData(loginSource === 'google' ? ytTracks : spTracks);
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
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="text-2xl font-bold p-6">Search</div>

      <form
        onSubmit={handleSearch}
        className="flex gap-3 px-6 mb-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border px-3 py-2 rounded-md bg-white text-black placeholder-gray-400 outline-none"
          placeholder="Find your track..."
        />
        <button
          type="submit"
          className="bg-white text-gray-700 px-4 py-2 rounded-md flex items-center justify-center"
        >
          <Icon path={mdiMagnify} size={1} />
        </button>
      </form>

      <div
        className="flex-1 overflow-y-auto px-6"
        style={{ maxHeight: 'calc(100vh - 300px)' }}
      >
        {isLoading ? (
          shimmerArr.map((_, i) => <Shimmer key={i} />)
        ) : data.length > 0 ? (
          data.map((obj, i) => (
            <SongCard
              key={i}
              image={obj.image}
              title={obj.title}
              id={obj.id}
              uri={obj.uri}
              channelName={obj.channelName}
              isSpotify={obj.platform === 'spotify'}
              setToastDisplay={setToastDisplay}
              setToastMsg={setToastMsg}
            />
          ))
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
              Listen to your favorite songs and artists with your
              loved ones together!
            </p>
          </div>
        )}

        {toastDisplay && (
          <div className="flex justify-center mt-4">
            <Toast message={toastMsg} />
          </div>
        )}
      </div>

      <div className="border-t border-zinc-700 p-4">
        <QueuePanel />
      </div>
    </div>
  );
};

export default Search;
