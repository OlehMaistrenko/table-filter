import { ReactNode } from "react";
import styles from "./PaginationButton.module.css";
import { ReactEventHandler } from "react";

export default function PaginationButton({
  isDisabled,
  onClick,
  isActive,
  children,
}: {
  isDisabled?: boolean;
  isActive?: boolean;
  onClick?: ReactEventHandler<Element>;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.button} ${isActive ? styles.active : ""} ${
        isDisabled ? styles.disabled : ""
      }`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
