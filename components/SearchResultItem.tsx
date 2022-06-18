import { FC, useCallback } from "react";

import styles from "../styles/SearchResultItem.module.css";

interface SearchResultItemProps {
  title: string;
  artist: string;
  uri: string;
  handleAddToQueue: Function;
}

const SearchResultItem: FC<SearchResultItemProps> = ({
  title,
  artist,
  uri,
  handleAddToQueue,
}) => {
  const handleClick = useCallback(() => {
    handleAddToQueue(title, artist, uri);
  }, [title, artist, uri]);

  return (
    <div className={styles.mainContainer}>
      <p className={styles.title}>{title}</p>
      <p className={styles.artist}>{artist}</p>
      <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleClick}>
          Add
        </button>
      </div>

      <div className={styles.line} />
    </div>
  );
};

export default SearchResultItem;
