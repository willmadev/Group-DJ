import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Button from "../../../components/Button";

import styles from "../../../styles/Join.module.css";

const Enter: NextPage = () => {
  const router = useRouter();
  const [sessionCode, setSessionCode] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (router.query.sessionCode) {
      setSessionCode(router.query.sessionCode.toString());
    }
  }, [router.query]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      (async () => {
        const response = await axios
          .post("/api/session/user", { sessionCode, name })
          .catch((err) => console.error(err));

        router.push(`/join/${sessionCode}/main?name=${name}`);
      })();
    },
    [name, sessionCode, router]
  );
  return (
    <div className={styles.mainContainer}>
      <h1>Group DJ</h1>
      <h3>Enter your name below</h3>
      <input type={"text"} onChange={handleInputChange} value={name} />
      <Button onClick={handleSubmit}>Join Session</Button>
    </div>
  );
};

export default Enter;
