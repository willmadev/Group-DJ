import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import toast, { Toaster } from "react-hot-toast";

import SearchResultItem from "../../../components/SearchResultItem";

import styles from "../../../styles/JoinScreen.module.css";

const JoinScreen: NextPage = () => {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState("");
  const [name, setName] = useState("");

  const [searchText, setSearchText] = useState("");

  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    if (router.query.sessionCode)
      setSessionCode(router.query.sessionCode.toString());
    if (router.query.name) setName(router.query.name.toString());
  }, [router.query]);

  const handleSearchChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  }, []);

  const handleSearchSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (searchText === "") return;

      const response: any = await axios.get("/api/spotify/search", {
        params: { q: searchText },
      });
      console.log(response);
      setSearchResults(response.data.tracks.items);
    },
    [searchText]
  );

  const handleAddToQueue = useCallback(
    async (title: string, artist: string, uri: string) => {
      await axios.put("/api/session", {
        sessionCode,
        user: name,
        title,
        artist,
        uri,
      });
      console.log("Song Added");
      toast("Song added to queue!");
    },
    [sessionCode, name]
  );

  return (
    <div className={styles.mainContainer}>
      <Toaster />
      <header className={styles.header}>
        <h1>Group DJ</h1>
        <h2>Add Songs to Queue</h2>
      </header>
      <form className={styles.form} onSubmit={handleSearchSubmit}>
        <input
          className={styles.searchBar}
          type={"text"}
          value={searchText}
          onChange={handleSearchChange}
          placeholder="Search Songs"
        />
      </form>
      <div className={styles.resultContainer}>
        {searchResults.map((result: any) => {
          const title = result.name;
          let artists: string[] = [];
          result.artists.forEach((artist: any) => artists.push(artist.name));
          const artist = artists.toString();
          const uri = result.uri;

          return (
            <SearchResultItem
              key={uri}
              title={title}
              artist={artist}
              uri={uri}
              handleAddToQueue={handleAddToQueue}
            />
          );
        })}
      </div>
    </div>
  );
};

export default JoinScreen;
