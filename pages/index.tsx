import type { NextPage } from "next";
import axios from "axios";
import { useRouter } from "next/router";

import { authorizeHostURL } from "../lib/spotify";
import Button from "../components/Button";

import styles from "../styles/Home.module.css";

interface HomeProps {
  authorizeHostURL: string;
}

const Home: NextPage<HomeProps> = ({ authorizeHostURL }) => {
  const router = useRouter();
  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>
        <h1>Group DJ</h1>
        <h2>Made by Willma</h2>
      </div>
      <div className={styles.buttonContainer}>
        <Button onClick={(e) => router.push(authorizeHostURL)}>
          Host Session
        </Button>
        <Button>Join Session</Button>
      </div>
    </div>
  );
};

export async function getServerSideProps() {
  return { props: { authorizeHostURL } };
}

export default Home;
