import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const ValidateCode: NextPage = () => {
  const router = useRouter();
  useEffect(() => {
    (async () => {
      if (!router.query.sessionCode) {
        return;
      }
      const sessionCode = router.query.sessionCode as string;

      const response = await axios.get(
        `/api/session?sessionCode=${sessionCode}`,
        { validateStatus: (status) => status < 500 }
      );
      if (response.status !== 200) {
        router.push(`/join?error=${response.data.error || "error"}`);
        return;
      }
      router.push(`/join/${sessionCode}/enter`);
    })();
  }, [router.query]);
  return <div>loading</div>;
};

export default ValidateCode;
