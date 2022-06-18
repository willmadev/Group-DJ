import { FC } from "react";

import styles from "../styles/QueueListItem.module.css";

interface QueueListItemProps {
  header?: boolean;
  index?: number;
  title?: number;
  artist?: number;
  user?: number;
}

const QueueListItem: FC<QueueListItemProps> = ({
  header,
  index,
  title,
  artist,
  user,
}) => {
  return (
    <div className={styles.queueListItemContainer}>
      {header ? (
        <div className={`${styles.textWrapper} ${styles.header}`}>
          <p>#</p>
          <p>Title</p>
          <p>Artist</p>
          <p>Added By</p>
        </div>
      ) : (
        <div className={`${styles.textWrapper} ${styles.listItem}`}>
          <p>{index}</p>
          <p>{title}</p>
          <p>{artist}</p>
          <p>{user}</p>
        </div>
      )}
      <div className={styles.line} />
    </div>
  );
};

export default QueueListItem;
