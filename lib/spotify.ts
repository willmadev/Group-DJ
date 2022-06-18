import SpotifyWebApi from "spotify-web-api-node";
import axios from "axios";

import { SPOTIFY_ID, SPOTIFY_SECRET, URL } from "./config";

const spotifyApi = new SpotifyWebApi({
  clientId: SPOTIFY_ID,
  clientSecret: SPOTIFY_SECRET,
  redirectUri: `${URL}/auth/spotify/callback`,
});

const generateRandomString = function (length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const scopes = ["streaming", "user-modify-playback-state"];
const state = generateRandomString(16);

export const authorizeHostURL = spotifyApi.createAuthorizeURL(scopes, state);

export const getTokens = async (code: string) => {
  let data;
  try {
    data = await spotifyApi.authorizationCodeGrant(code);
  } catch (err) {
    console.error("Authorization Code Error");
    return { error: true };
  }

  const { expires_in, access_token, refresh_token } = data.body;
  return { expires_in, access_token, refresh_token };
};

export const refreshToken = async (refreshToken: string) => {
  spotifyApi.setRefreshToken(refreshToken);
  let response;
  try {
    response = await spotifyApi.refreshAccessToken();
  } catch (err) {
    console.error("Refresh Token Error");
    return { error: true };
  }
  return response.body;
};

export const searchSong = async (query: string) => {
  const { access_token } = (await spotifyApi.clientCredentialsGrant()).body;
  spotifyApi.setAccessToken(access_token);
  const { body } = await spotifyApi.searchTracks(query);
  return body;
};

export const playTrack = async (
  access_token: string,
  uri: string,
  device_id: string
) => {
  spotifyApi.setAccessToken(access_token);
  try {
    await spotifyApi.play({ uris: [uri], device_id });
  } catch (err) {
    console.error(err);
  }
};
