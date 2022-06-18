import axios, { AxiosResponse } from "axios";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { handleAuthCode } from "../../../lib/spotifyClient";

const createSession = async () => {
  const response = await axios.post("/api/session");
  if (response.status === 200) {
    return { code: response.data.code };
  } else {
    return { error: true };
  }
};

const SpotifyCallback: NextPage = () => {
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    (async () => {
      const { code } = router.query;
      if (typeof code !== "string") {
        return;
      }

      const authCodeResult = await handleAuthCode(code);
      if (authCodeResult?.error) {
        setError(true);
        return;
      }

      const sessionResult = await createSession();
      if (sessionResult?.code) {
        router.push(`/host/${sessionResult.code}`);
      } else if (sessionResult?.error) {
        setError(true);
        return;
      }
    })();
  }, [router]);

  if (error) {
    return (
      <div>
        <h2>An error occured</h2>
        <p>Please try again</p>
        <Link href="/">Return to home page</Link>
      </div>
    );
  }
  return <div>Loading...</div>;
};

export default SpotifyCallback;
