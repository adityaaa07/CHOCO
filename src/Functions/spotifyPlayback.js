import { getSpotifyAccessToken } from "./spotifyPlayHelper";

export const playSpotifyTrack = async (trackUri) => {
  const token = await getSpotifyAccessToken();
  const device_id = localStorage.getItem('spotifyDeviceId'); // save it when ready

  if (!device_id) {
    console.error('No Spotify Device ID found.');
    return;
  }

  try {
    await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [trackUri] }),
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log('Playing track on Spotify:', trackUri);
  } catch (error) {
    console.error('Error playing Spotify track:', error);
  }
};
