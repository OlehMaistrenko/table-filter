import { useState } from "react";
import styles from "./Pagination.module.css";
import PaginationButton from "./PaginationButton";

export default function Pagination({
  count,
  page,
  onChange,
}: {
  count: number;
  page: number;
  onChange: (value: number) => void;
}) {
  const goTo = (page: number) => {
    onChange(page);
  };
  let buttons = [
    <PaginationButton onClick={() => goTo(1)} isActive={1 === page}>
      1
    </PaginationButton>,
  ];

  if (page > 3) {
    buttons.push(<PaginationButton isDisabled={true}>...</PaginationButton>);
  }
  for (let i = page - 1; i <= page + 1; i++) {
    if (i > 1 && i < count) {
      buttons.push(
        <PaginationButton onClick={() => goTo(i)} isActive={i === page}>
          {i}
        </PaginationButton>
      );
    }
  }
  if (page < count - 2) {
    buttons.push(<PaginationButton isDisabled={true}>...</PaginationButton>);
  }
  if (count > 1) {
    buttons.push(
      <PaginationButton onClick={() => goTo(count)} isActive={count === page}>
        {count}
      </PaginationButton>
    );
  }

  return (
    <nav className={styles.pagination}>
      <ul>
        <li>
          <PaginationButton onClick={() => goTo(1)} isDisabled={page === 1}>
            {"<<"}
          </PaginationButton>
        </li>
        <li>
          <PaginationButton
            onClick={() => goTo(page - 1)}
            isDisabled={page === 1}
          >
            {"<"}
          </PaginationButton>
        </li>
        {buttons.map((button, index) => (
          <li key={index}>{button}</li>
        ))}
        <li>
          <PaginationButton
            onClick={() => goTo(page + 1)}
            isDisabled={page === count}
          >
            {">"}
          </PaginationButton>
        </li>
        <li>
          <PaginationButton
            onClick={() => goTo(count)}
            isDisabled={page === count}
          >
            {">>"}
          </PaginationButton>
        </li>
      </ul>
    </nav>
  );
}
