import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStateContext } from '../Context/ContextProvider';
import Cookies from 'js-cookie';
import { signInAnonymously } from 'firebase/auth';
import { auth } from '../firebase-config';

const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken, setLoginSource } = useStateContext();
  const [error, setError] = useState('');

  const fetchUserInfo = async (accessToken) => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const { display_name, id, email } = response.data;
      sessionStorage.setItem('spotify_user_id', id);
      Cookies.set('name', display_name || email || id);
      Cookies.set('email', email || '');
      console.log('Spotify user info fetched:', display_name || id);
    } catch (error) {
      console.error('Error fetching Spotify user info:', error.message);
      setError('Failed to fetch user info');
    }
  };

  const refreshSpotifyToken = async () => {
    const refreshToken = sessionStorage.getItem('spotify_refresh_token');
    if (!refreshToken) {
      console.error('No refresh token found');
      setError('No refresh token available');
      return null;
    }
    try {
      const response = await axios.post('https://choco-flax.vercel.app/api/spotify/refresh', {
        refresh_token: refreshToken,
      });
      const { access_token, expires_in } = response.data;
      sessionStorage.setItem('spotify_token', access_token);
      sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('loginSource', 'spotify');
      setToken(access_token);
      setLoginSource('spotify');
      console.log('Spotify token refreshed');
      return access_token;
    } catch (error) {
      console.error('Failed to refresh token:', error.message);
      setError('Failed to refresh Spotify token');
      return null;
    }
  };

  useEffect(() => {
    const handleCallback = async () => {
      const storedToken = sessionStorage.getItem('spotify_token');
      const expiry = sessionStorage.getItem('spotify_token_expiry');
      const refreshToken = sessionStorage.getItem('spotify_refresh_token');

      // Check if token is valid
      if (storedToken && expiry && Date.now() < parseInt(expiry)) {
        console.log('Using existing Spotify token');
        localStorage.setItem('loginSource', 'spotify');
        localStorage.setItem('spotify_access_token', storedToken);
        setToken(storedToken);
        setLoginSource('spotify');
        await fetchUserInfo(storedToken);
        navigate('/home');
        return;
      }

      // Try refreshing token if refresh_token exists
      if (refreshToken) {
        const newToken = await refreshSpotifyToken();
        if (newToken) {
          await fetchUserInfo(newToken);
          navigate('/home');
          return;
        }
      }

      // Handle new login
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (!code) {
        console.warn('No authorization code in URL');
        setError('No authorization code provided');
        navigate('/');
        return;
      }

      try {
        // Authenticate with Firebase
        await signInAnonymously(auth);
        console.log('Signed in anonymously to Firebase');

        // Request Spotify token
        const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', { code });
        const { access_token, refresh_token, expires_in } = response.data;

        if (!access_token) {
          console.error('No access token in response');
          setError('Failed to obtain Spotify token');
          navigate('/');
          return;
        }

        // Store tokens and user data
        sessionStorage.setItem('spotify_token', access_token);
        sessionStorage.setItem('spotify_refresh_token', refresh_token);
        sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('loginSource', 'spotify');
        setToken(access_token);
        setLoginSource('spotify');
        await fetchUserInfo(access_token);
        console.log('Spotify login successful, navigating to /home');
        navigate('/home');
      } catch (error) {
        console.error('Spotify callback error:', error.message, error.response?.data);
        setError('Authentication failed: ' + error.message);
        navigate('/');
      }
    };

    handleCallback();
  }, [navigate, setToken, setLoginSource]);

  return (
    <div className="text-white p-4">
      {error ? (
        <div className="bg-red-600 p-4 rounded-lg">
          <p>Error: {error}</p>
          <p>Please try logging in again.</p>
        </div>
      ) : (
        <p>Authenticating with Spotify...</p>
      )}
    </div>
  );
};

export default SpotifyCallback;

/*
import axios from 'axios';
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../Context/ContextProvider";
const SpotifyCallback = () => {
  const navigate = useNavigate();
  const { setToken } = useStateContext();

  const refreshSpotifyToken = async () => {
    const refreshToken = sessionStorage.getItem('spotify_refresh_token');
    if (!refreshToken) {
      console.error('No refresh token found');
      navigate('/');
      return;
    }

    try {
      const response = await axios.post('https://choco-flax.vercel.app/api/spotify/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, expires_in } = response.data;
      if (access_token) {
        sessionStorage.setItem('spotify_token', access_token);
        sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
        localStorage.setItem('spotify_access_token', access_token);
        localStorage.setItem('loginSource', 'spotify');
        setToken(access_token);
        navigate('/home');
      } else {
        console.error('No access token in refresh response');
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      navigate('/');
    }
  };

  useEffect(() => {
    const storedToken = sessionStorage.getItem('spotify_token');
    const expiry = sessionStorage.getItem('spotify_token_expiry');

    if (storedToken && expiry && Date.now() < parseInt(expiry)) {
      localStorage.setItem('loginSource', 'spotify');
      localStorage.setItem('spotify_access_token', storedToken);
      setToken(storedToken);
      navigate('/home');
    } else if (sessionStorage.getItem('spotify_refresh_token')) {
      refreshSpotifyToken();
    }
  }, [navigate, setToken]);

  useEffect(() => {
    const fetchToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      console.log("Received code:", code);

      if (!code) {
        console.warn("No code found in URL");
        navigate('/');
        return;
      }

      try {
        const response = await axios.post('https://choco-flax.vercel.app/api/spotify/token', { code });
        console.log("Token API response:", response.data);

        const { access_token, refresh_token, expires_in } = response.data;

        if (access_token) {
          sessionStorage.setItem('spotify_token', access_token);
          sessionStorage.setItem('spotify_refresh_token', refresh_token);
          sessionStorage.setItem('spotify_token_expiry', Date.now() + expires_in * 1000);
          localStorage.setItem('spotify_access_token', access_token);
          localStorage.setItem('loginSource', 'spotify');
          setToken(access_token);
          navigate('/home');
        } else {
          console.error("Access token missing in response");
          navigate('/');
        }
      } catch (error) {
        console.error('Error getting Spotify token:', error.response?.data || error.message);
        navigate('/');
      }
    };

    fetchToken();
  }, [setToken, navigate]);

  return <div className="text-white p-4">Authenticating with Spotify...</div>;
};

export default SpotifyCallback;

*/
