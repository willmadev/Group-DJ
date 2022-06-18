import { FC } from "react";

import styles from "../styles/QueueModule.module.css";
import QueueListItem from "./QueueListItem";

interface QueueModuleProps {
  queue: any[];
  currentTrack: number;
}

const QueueModule: FC<QueueModuleProps> = ({ queue }) => {
  return (
    <>
      <h2>Queue</h2>
      <div className={styles.queueContainer}>
        <QueueListItem header />
        {queue.map((track, index) => (
          <QueueListItem
            index={index + 1}
            key={index}
            title={track.title}
            artist={track.artist}
            user={track.user}
          />
        ))}
      </div>
    </>
  );
};

export default QueueModule;
