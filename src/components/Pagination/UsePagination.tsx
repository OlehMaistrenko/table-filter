import usePagination from "@mui/material/usePagination";
import styles from "./Pagination.module.css";
import PaginationButton from "./PaginationButton";

export default function UsePagination({
  count,
  page,
  onChange,
}: {
  count: number;
  page: number;
  onChange: (
    event: React.ChangeEvent<unknown>,
    page: number
  ) => void | undefined;
}) {
  const { items } = usePagination({
    count,
    page,
    onChange,
    showFirstButton: true,
    showLastButton: true,
  });

  const buttonRenderSwitch = (type: "first" | "last" | "next" | "previous") => {
    switch (type) {
      case "first":
        return "<<";
      case "last":
        return ">>";
      case "previous":
        return "<";
      case "next":
        return ">";
    }
  };

  return (
    <nav className={styles.pagination}>
      <ul>
        {items.map(({ page, type, selected, ...item }, index) => {
          let children = null;

          if (type === "start-ellipsis" || type === "end-ellipsis") {
            children = "…";
          } else if (type === "page") {
            children = (
              <PaginationButton
                onClick={item.onClick}
                isDisabled={item.disabled}
                isActive={selected}
              >
                {page}
              </PaginationButton>
            );
          } else {
            children = (
              <PaginationButton
                onClick={item.onClick}
                isDisabled={item.disabled}
              >
                {buttonRenderSwitch(type)}
              </PaginationButton>
            );
          }

          return <li key={index}>{children}</li>;
        })}
      </ul>
    </nav>
  );
}
