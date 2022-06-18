import axios from "axios";
import { STATES } from "mongoose";
import {
  ChangeEvent,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import SpotifyWebApi from "spotify-web-api-node";
import { refreshAccessToken } from "../lib/spotifyClient";

import style from "../styles/PlayerModule.module.css";

declare var window: any;

type WebPlaybackState = {
  context: {
    uri: string; // The URI of the context (can be null)
    metadata: {}; // Additional metadata for the context (can be null)
  };
  disallows: {
    // A simplified set of restriction controls for
    pausing: boolean; // The current track. By default, these fields
    peeking_next: boolean; // will either be set to false or undefined, which
    peeking_prev: boolean; // indicates that the particular operation is
    resuming: boolean; // allowed. When the field is set to `true`, this
    seeking: boolean; // means that the operation is not permitted. For
    skipping_next: boolean; // example, `skipping_next`, `skipping_prev` and
    skipping_prev: boolean; // `seeking` will be set to `true` when playing an
    // ad track.
  };
  paused: boolean; // Whether the current track is paused.
  position?: number; // The position_ms of the current track.
  duration?: number;
  repeat_mode: number; // The repeat mode. No repeat mode is 0,
  // repeat context is 1 and repeat track is 2.
  shuffle: boolean; // True if shuffled, false otherwise.
  track_window: {
    current_track: WebPlaybackTrack; // <WebPlaybackTrack>,                              // The track currently on local playback
    previous_tracks: [WebPlaybackTrack]; // [<WebPlaybackTrack>, <WebPlaybackTrack>, ...], // Previously played tracks. Number can vary.
    next_tracks: [WebPlaybackTrack]; // [<WebPlaybackTrack>, <WebPlaybackTrack>, ...]      // Tracks queued next. Number can vary.
  };
};

type WebPlaybackTrack = {
  uri: string; // Spotify URI
  id: string; // Spotify ID from URI (can be null)
  type: string; // Content type: can be "track", "episode" or "ad"
  media_type: string; // Type of file: can be "audio" or "video"
  name: string; // Name of content
  is_playable: boolean; // Flag indicating whether it can be played
  album: {
    uri: string; // Spotify Album URI
    name: string;
    images: [{ url: string }];
  };
  artists: [{ uri: string; name: string }];
};

interface PlayerModuleProps {
  sessionCode: string;
  deviceId: string;
  setDeviceId: Dispatch<SetStateAction<string>>;
}

const PlayerModule: FC<PlayerModuleProps> = ({
  sessionCode,
  deviceId,
  setDeviceId,
}) => {
  const [player, setPlayer] = useState<any>(undefined);
  const [playerState, setPlayerState] = useState<WebPlaybackState>();
  const [seekPosition, setSeekPosition] = useState(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log("Creating player");
      alert("Please click okay");
      const player = new window.Spotify.Player({
        name: "Group DJ",
        getOAuthToken: async (cb: any) => {
          await refreshAccessToken();
          const access_token = localStorage.getItem("access_token");
          cb(access_token);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }: any) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);

        console.log("Starting interval");
        const interval = setInterval(async () => {
          const state: WebPlaybackState | null = await player.getCurrentState();
          if (state && state.position) {
            setSeekPosition(state.position);
          }
        }, 500);
      });

      player.addListener("not_ready", ({ device_id }: any) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.addListener("player_state_changed", (state: WebPlaybackState) => {
        console.log({ state });
        console.log("Currently Playing", state.track_window.current_track);
        setPlayerState(state);
        setSeekPosition(state.position || 0);
      });

      player.connect();
    };
    return;
  }, []);

  const handleSeekChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      player.seek(parseInt(e.target.value));
      setSeekPosition(parseInt(e.target.value));
    },
    [player]
  );

  const [artists, setArtists] = useState("");
  useEffect(() => {
    let artists: string[] = [];
    playerState?.track_window.current_track.artists.forEach((artist) =>
      artists.push(artist.name)
    );
    setArtists(artists.toString());
  }, [player, playerState]);

  useEffect(() => {
    if (sessionCode === "" || deviceId === "") {
      return;
    }
    if (playerState?.position !== playerState?.duration) {
      return;
    }
    axios.post("/api/session/state", {
      status: "play_next",
      access_token: localStorage.getItem("access_token"),
      sessionCode,
      device_id: deviceId,
    });
  }, [playerState, sessionCode, deviceId]);

  return (
    <div>
      <h2>Now Playing</h2>
      <div className={style.playerContainer}>
        {playerState?.track_window.current_track ? (
          <>
            <img
              className={style.albumArt}
              src={playerState?.track_window.current_track.album.images[0].url}
            />
            <div className={style.trackDetails}>
              <h1>{playerState?.track_window.current_track.name}</h1>
              <h2>{artists}</h2>
              <input
                type="range"
                min="0"
                max={playerState?.duration}
                value={seekPosition}
                onChange={handleSeekChange}
              />
            </div>
          </>
        ) : (
          <h1>No Song Playing</h1>
        )}
      </div>
    </div>
  );
};

export default PlayerModule;
