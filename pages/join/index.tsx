import { NextPage } from "next";
import { useRouter } from "next/router";
import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import Button from "../../components/Button";

import styles from "../../styles/Join.module.css";

const Join: NextPage = () => {
  const router = useRouter();
  const [inputCode, setInputCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const errors = {
      session_not_found: "Session not found, please try again.",
    };
    if (router.query.error) {
      const errorCode = router.query.error as string;
      if (errorCode in errors) {
        setErrorMessage(errors[errorCode as keyof typeof errors]);
      } else {
        setErrorMessage("An error occured. Please try again.");
      }
    }
  }, [router.query]);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 6) {
      return;
    }
    setInputCode(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setErrorMessage("");
      if (inputCode.length != 6) {
        setErrorMessage("Invalid Code Entered");
        return;
      }

      router.push(`/join/${inputCode}`);
    },
    [inputCode]
  );
  return (
    <div className={styles.mainContainer}>
      <h1>Group DJ</h1>
      <h3>Enter session code below</h3>
      <input type={"number"} onChange={handleInputChange} value={inputCode} />
      <Button onClick={handleSubmit}>Join Session</Button>
      <p className={styles.errorMessage}>{errorMessage}</p>
    </div>
  );
};

export default Join;
