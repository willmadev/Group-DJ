import axios from "axios";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useEffect, useState } from "react";

import { URL } from "../../lib/config";
import { fetcher } from "../../lib/fetcher";
import PlayerModule from "../../components/PlayerModule";
import QueueModule from "../../components/QueueModule";
import DetailsModule from "../../components/DetailsModule";
import ParticipantsModule from "../../components/ParticipantsModule";

import styles from "../../styles/HostScreen.module.css";

export type SessionPayload = {
  sessionCode: string;
  queue: [
    {
      title: string;
      artist: string;
      uri: string;
      user: string;
    }
  ];
  participants: string[];
  currentTrack: number;
  state: "stopped" | "playing";
};

const HostScreen = () => {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState("");

  useEffect(() => {
    if (!router.query.sessionCode) return;
    const sessionCode = router.query.sessionCode as string;
    setSessionCode(sessionCode);
  }, [router.query]);

  const { data, error } = useSWR<SessionPayload>(
    sessionCode ? `/api/session?sessionCode=${sessionCode}` : null,
    {
      // @ts-ignore
      fetcher,
      refreshInterval: 1000,
    }
  );

  const [queue, setQueue] = useState<any[]>([]);
  const [deviceId, setDeviceId] = useState("");
  useEffect(() => {
    (async () => {
      // if new song is added and queue is stopped

      if (sessionCode === "" || deviceId === "") {
        return;
      }
      console.log({ sessionCode });

      if (data?.queue !== queue && data?.state === "stopped") {
        setQueue(data.queue);

        console.log("Start playing");
        await axios.post("/api/session/state", {
          status: "play_next",
          access_token: localStorage.getItem("access_token"),
          sessionCode,
          device_id: deviceId,
        });
      }
    })();
  }, [data, sessionCode, deviceId]);

  if (error) {
    console.error(error);
    return <div>an error occured</div>;
  }
  console.log(data);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.playerContainer}>
        <PlayerModule
          sessionCode={sessionCode}
          deviceId={deviceId}
          setDeviceId={setDeviceId}
        />
      </div>
      <div className={styles.queueContainer}>
        <QueueModule
          queue={data?.queue.slice(1) || []}
          currentTrack={data?.currentTrack!}
        />
      </div>
      <div className={styles.participantContainer}>
        <ParticipantsModule participants={data?.participants || []} />
      </div>
      <div className={styles.detailsContainer}>
        {sessionCode ? (
          <DetailsModule sessionCode={sessionCode.toString()} />
        ) : null}
      </div>
    </div>
  );
};

export default HostScreen;
