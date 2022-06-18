import { FC } from "react";
import { QRCodeSVG } from "qrcode.react";
import { URL } from "../lib/config";

import styles from "../styles/DetailsModule.module.css";
import Link from "next/link";

interface DetailsModuleProps {
  sessionCode: string;
}

const DetailsModule: FC<DetailsModuleProps> = ({ sessionCode }) => {
  return (
    <div className={styles.container}>
      <h3>
        Join the session by scanning the QR code below or entering the session
        code at: <Link href="/join">{URL}/join</Link>
      </h3>
      <QRCodeSVG value={`${URL}/join/${sessionCode}`} size={150} level="L" />
      <h3>Session Code: {sessionCode}</h3>
    </div>
  );
};

export default DetailsModule;
