export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.error('Invalid request method:', req.method); // Log invalid method
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { code } = req.body;

  if (!code) {
    console.error('No authorization code received'); // Log missing code
    return res.status(400).json({ error: 'Missing code parameter' });
  }

  const clientId = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.REACT_APP_SPOTIFY_REDIRECT_URI;

  // Check for missing environment variables
  if (!clientId || !clientSecret || !redirectUri) {
    console.error('Missing environment variables'); // Log missing env variables
    return res.status(500).json({ error: 'Missing environment variables' });
  }

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('code', code);
  params.append('redirect_uri', redirectUri);

  try {
    // Dynamically import node-fetch
    const fetch = (await import('node-fetch')).default;

    const response = await fetch('https://accounts.spotify.com/api/spotify/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Spotify API error:', data); // Log Spotify API error
      return res.status(response.status).json({ error: data.error_description || data.error });
    }

    return res.status(200).json(data); // Successfully returned data

  } catch (error) {
    console.error('Unexpected error during token exchange:', error); // Log unexpected errors
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
