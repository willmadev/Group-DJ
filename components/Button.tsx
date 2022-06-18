import { FC, MouseEventHandler, ReactNode } from "react";

import styles from "../styles/Button.module.css";

interface ButtonProps {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  children?: React.ReactNode;
}

const Button: FC<ButtonProps> = ({ children, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
